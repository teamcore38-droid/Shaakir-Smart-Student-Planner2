/**
 * App.js — Application Entry Point
 *
 * Smart Student Planner
 * A premium mobile application for academic task management.
 *
 * Architecture: MVVM (Model-View-ViewModel)
 *   - Models: Task objects persisted via AsyncStorage (StorageService)
 *   - ViewModels: AuthContext & TaskContext provide business logic
 *   - Views: React Native screen components
 *
 * This file wires together the context providers and navigation tree.
 * StatusBar is configured globally here for consistency.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Light status bar to match our clean theme */}
      <StatusBar style="dark" />

      {/* Auth provider wraps everything — user state is globally available */}
      <AuthProvider>
        {/* Task provider nested inside Auth — tasks belong to authenticated sessions */}
        <TaskProvider>
          <AppNavigator />
        </TaskProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
