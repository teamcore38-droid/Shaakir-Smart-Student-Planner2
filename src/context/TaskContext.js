/**
 * TaskContext — Task State Management (Firebase Integration)
 *
 * Implements CRUD operations connected to Cloud Firestore:
 *   AddTask, EditTask, DeleteTask, MarkTaskComplete/Incomplete, SearchTasks
 *
 * Architecture (MVVM):
 *   - Model: Firestore Database ('tasks' collection)
 *   - ViewModel: TaskContext providing real-time data sync & query sorting
 *   - View: React Native screens
 */

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useAuth } from './AuthContext';
import ValidationService from '../services/ValidationService';
import { sortTasks, getTaskStats } from '../utils/helpers';
import { FILTER_OPTIONS, SORT_OPTIONS, MODULES } from '../utils/constants';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(FILTER_OPTIONS.ALL);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DUE_DATE);
  const [customModules, setCustomModules] = useState([]);

  // Sync tasks in real time from Firestore whenever the user state changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Query tasks belonging exclusively to the authenticated user
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = [];
      snapshot.forEach((docSnap) => {
        fetchedTasks.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      setTasks(fetchedTasks);
      setIsLoading(false);
    }, (error) => {
      console.error('[TaskContext] Firestore listener error:', error);
      setIsLoading(false);
    });

    // Clean up subscriber on user change or unmount
    return unsubscribe;
  }, [user]);

  // Sync custom modules in real time from Firestore whenever the user state changes
  useEffect(() => {
    if (!user) {
      setCustomModules([]);
      return;
    }

    const qModules = query(
      collection(db, 'modules'),
      where('userId', '==', user.id)
    );

    const unsubscribeModules = onSnapshot(qModules, (snapshot) => {
      const fetchedModules = [];
      snapshot.forEach((docSnap) => {
        fetchedModules.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      // Sort custom modules alphabetically by name
      fetchedModules.sort((a, b) => a.name.localeCompare(b.name));
      setCustomModules(fetchedModules);
    }, (error) => {
      console.error('[TaskContext] Firestore modules listener error:', error);
    });

    return unsubscribeModules;
  }, [user]);

  /**
   * Add a custom module category in Firestore.
   */
  const addCustomModule = async (name) => {
    if (!user) {
      return { success: false, error: 'You must be signed in to add module categories.' };
    }

    const cleanName = name.trim();
    if (!cleanName) {
      return { success: false, error: 'Module name cannot be empty.' };
    }

    // Check if duplicate exists in default or custom list (case-insensitive)
    const existsInDefaults = MODULES.map(m => m.toLowerCase()).includes(cleanName.toLowerCase());
    const existsInCustom = customModules.map(m => m.name.toLowerCase()).includes(cleanName.toLowerCase());

    if (existsInDefaults || existsInCustom) {
      return { success: false, error: 'A module with this name already exists.' };
    }

    try {
      const newModule = {
        userId: user.id,
        name: cleanName,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'modules'), newModule);
      return { success: true, module: { id: docRef.id, ...newModule } };
    } catch (err) {
      console.error('[TaskContext] Add custom module failed:', err);
      return { success: false, error: 'Failed to create module category. Please try again.' };
    }
  };

  /**
   * Delete a custom module category from Firestore.
   */
  const deleteCustomModule = async (moduleId) => {
    if (!user) {
      return { success: false, error: 'You must be signed in.' };
    }

    try {
      const moduleDocRef = doc(db, 'modules', moduleId);
      await deleteDoc(moduleDocRef);
      return { success: true };
    } catch (err) {
      console.error('[TaskContext] Delete custom module failed:', err);
      return { success: false, error: 'Failed to delete module category. Please try again.' };
    }
  };

  // Dynamically compute all modules: Predefined options (excluding "Other") + Custom modules + "Other"
  const predefinedWithoutOther = MODULES.filter((m) => m !== 'Other');
  const customNames = customModules.map((m) => m.name);
  const allModules = [...predefinedWithoutOther, ...customNames, 'Other'];

  /* ────────── CRUD Operations ────────── */

  /**
   * Add a new task in Firestore.
   */
  const addTask = async ({ title, module, dueDate, priority, notes }) => {
    if (!user) {
      return { success: false, errors: { general: 'You must be signed in to add tasks.' } };
    }

    const validation = ValidationService.validateTask(title, module, dueDate, priority);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const notesValidation = ValidationService.validateNotes(notes);
    if (!notesValidation.isValid) {
      return { success: false, errors: { notes: notesValidation.error } };
    }

    try {
      const newTask = {
        userId: user.id,
        title: title.trim(),
        module: module.trim(),
        dueDate,
        priority,
        notes: notes?.trim() || '',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      return { success: true, task: { id: docRef.id, ...newTask } };
    } catch (err) {
      console.error('[TaskContext] Add task failed:', err);
      return { success: false, errors: { general: 'Failed to add task. Please try again.' } };
    }
  };

  /**
   * Edit an existing task in Firestore.
   */
  const editTask = async (taskId, updates) => {
    if (!user) {
      return { success: false, errors: { general: 'You must be signed in to edit tasks.' } };
    }

    try {
      if (
        updates.title !== undefined || 
        updates.module !== undefined || 
        updates.dueDate !== undefined || 
        updates.priority !== undefined
      ) {
        const currentTask = tasks.find((t) => t.id === taskId);
        if (!currentTask) {
          return { success: false, errors: { general: 'Task not found.' } };
        }

        const merged = { ...currentTask, ...updates };
        const validation = ValidationService.validateTask(merged.title, merged.module, merged.dueDate, merged.priority);
        if (!validation.isValid) {
          return { success: false, errors: validation.errors };
        }
      }

      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (err) {
      console.error('[TaskContext] Edit task failed:', err);
      return { success: false, errors: { general: 'Failed to update task. Please try again.' } };
    }
  };

  /**
   * Delete a task from Firestore.
   */
  const deleteTask = async (taskId) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskDocRef);
      return { success: true };
    } catch (err) {
      console.error('[TaskContext] Delete task failed:', err);
      return { success: false, errors: { general: 'Failed to delete task. Please try again.' } };
    }
  };

  /**
   * Toggle completion status.
   */
  const toggleTaskComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, {
        completed: !task.completed,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[TaskContext] Toggle task complete failed:', err);
    }
  };

  /**
   * Seed sample task data for all implemented academic modules.
   */
  const seedSampleTasks = async () => {
    if (!user) {
      return { success: false, error: 'You must be signed in to seed sample tasks.' };
    }

    try {
      const today = new Date();
      
      // Helper to generate ISO due dates relative to today
      const getDateOffset = (days) => {
        const date = new Date();
        date.setDate(today.getDate() + days);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };

      const sampleTasks = [
        {
          title: 'Design high-fidelity UI mockups',
          module: 'Mobile App Development',
          dueDate: getDateOffset(3),
          priority: 'high',
          notes: 'Prepare Figma frames for home, login, and settings screens with consistent themes.',
          completed: false,
        },
        {
          title: 'Configure Firebase Authentication',
          module: 'Mobile App Development',
          dueDate: getDateOffset(7),
          priority: 'medium',
          notes: 'Hook up login/register flows with Firebase Auth SDK.',
          completed: true,
        },
        {
          title: "Implement Dijkstra's Algorithm in Python",
          module: 'Data Structures & Algorithms',
          dueDate: getDateOffset(2),
          priority: 'high',
          notes: 'Write clean, commented Python implementation with time complexity analysis.',
          completed: false,
        },
        {
          title: 'Solve 5 problems on Tree Traversals',
          module: 'Data Structures & Algorithms',
          dueDate: getDateOffset(10),
          priority: 'low',
          notes: 'Solve binary search tree problems on LeetCode/HackerRank.',
          completed: false,
        },
        {
          title: 'Draft software requirements specification (SRS)',
          module: 'Software Engineering',
          dueDate: getDateOffset(5),
          priority: 'medium',
          notes: 'Write the functional and non-functional requirements sections for the client project.',
          completed: false,
        },
        {
          title: 'Create UML Class and Sequence Diagrams',
          module: 'Software Engineering',
          dueDate: getDateOffset(8),
          priority: 'low',
          notes: 'Draft architecture flow for microservices interaction.',
          completed: false,
        },
        {
          title: 'Design E-R Diagram for e-commerce project',
          module: 'Database Systems',
          dueDate: getDateOffset(4),
          priority: 'high',
          notes: 'Draw entities, relationships, cardinalities, and primary/foreign keys.',
          completed: false,
        },
        {
          title: 'Write SQL queries for normalization assignment',
          module: 'Database Systems',
          dueDate: getDateOffset(9),
          priority: 'medium',
          notes: 'Ensure all tables meet 3NF guidelines.',
          completed: false,
        },
        {
          title: 'Train custom Convolutional Neural Network (CNN)',
          module: 'Artificial Intelligence',
          dueDate: getDateOffset(6),
          priority: 'high',
          notes: 'Train PyTorch model for image classification and evaluate test accuracy.',
          completed: false,
        },
        {
          title: 'Read paper on Transformers and summarize',
          module: 'Artificial Intelligence',
          dueDate: getDateOffset(12),
          priority: 'low',
          notes: 'Focus on Attention Is All You Need paper, note down key equations.',
          completed: false,
        },
        {
          title: 'Build responsive CSS grid dashboard',
          module: 'Web Development',
          dueDate: getDateOffset(4),
          priority: 'medium',
          notes: 'Develop responsive grid layout with collapsible side navigation bar.',
          completed: false,
        },
        {
          title: 'Deploy Next.js application to Vercel',
          module: 'Web Development',
          dueDate: getDateOffset(11),
          priority: 'low',
          notes: 'Set up environmental variables and configure build command.',
          completed: true,
        },
        {
          title: 'Simulate TCP packet transmission in Cisco Packet Tracer',
          module: 'Computer Networks',
          dueDate: getDateOffset(8),
          priority: 'medium',
          notes: 'Set up a small routing topology and capture ICMP/TCP packets.',
          completed: false,
        },
        {
          title: 'Conduct penetration test on dummy web application',
          module: 'Cyber Security',
          dueDate: getDateOffset(5),
          priority: 'high',
          notes: 'Find SQL Injection and XSS vulnerabilities, write down remediation recommendations.',
          completed: false,
        },
        {
          title: 'Prepare presentation slides for group seminar',
          module: 'Other',
          dueDate: getDateOffset(1),
          priority: 'medium',
          notes: 'Review final draft with group members before uploading slides.',
          completed: false,
        },
      ];

      // Add each task to Firestore
      const promises = sampleTasks.map((t) => {
        const newTask = {
          userId: user.id,
          ...t,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return addDoc(collection(db, 'tasks'), newTask);
      });

      await Promise.all(promises);
      return { success: true };
    } catch (err) {
      console.error('[TaskContext] Seeding tasks failed:', err);
      return { success: false, error: 'Failed to seed sample tasks. Please try again.' };
    }
  };

  /* ────────── Search & Filter ────────── */

  const getFilteredTasks = useCallback(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const queryStr = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(queryStr) ||
          task.module.toLowerCase().includes(queryStr) ||
          (task.notes && task.notes.toLowerCase().includes(queryStr))
      );
    }

    // Apply completion status filter
    switch (activeFilter) {
      case FILTER_OPTIONS.ACTIVE:
        filtered = filtered.filter((t) => !t.completed);
        break;
      case FILTER_OPTIONS.COMPLETED:
        filtered = filtered.filter((t) => t.completed);
        break;
      default:
        break;
    }

    // Apply sorting selection
    return sortTasks(filtered, sortBy);
  }, [tasks, searchQuery, activeFilter, sortBy]);

  const getTaskById = (taskId) => {
    return tasks.find((t) => t.id === taskId) || null;
  };

  // Compute stats reactively based on current task list
  const stats = getTaskStats(tasks);

  return (
    <TaskContext.Provider
      value={{
        // State
        tasks,
        isLoading,
        searchQuery,
        activeFilter,
        sortBy,
        stats,
        customModules,
        allModules,

        // Actions
        addTask,
        editTask,
        deleteTask,
        toggleTaskComplete,
        seedSampleTasks,
        getTaskById,
        getFilteredTasks,
        addCustomModule,
        deleteCustomModule,

        // Setters
        setSearchQuery,
        setActiveFilter,
        setSortBy,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
