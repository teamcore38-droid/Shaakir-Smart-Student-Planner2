/**
 * Utility Helpers
 *
 * Pure functions used across multiple screens and components.
 * Keeping logic here avoids duplication and simplifies unit testing.
 */

/**
 * Generate a UUID-v4 style identifier.
 * Used as primary key for tasks so each record is uniquely addressable.
 */
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Format an ISO date string into a human-readable form.
 * @param {string} dateString - ISO 8601 date
 * @returns {string} e.g. "15 Mar 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'No date set';
  const date = new Date(dateString);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Calculate how many days remain until a given date.
 * Returns a descriptive string (e.g. "Due today", "3 days left", "Overdue").
 */
export const getDaysRemaining = (dateString) => {
  if (!dateString) return { text: 'No deadline', isOverdue: false, isToday: false };

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);

  const diffMs = due - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`, isOverdue: true, isToday: false };
  }
  if (diffDays === 0) {
    return { text: 'Due today', isOverdue: false, isToday: true };
  }
  if (diffDays === 1) {
    return { text: 'Due tomorrow', isOverdue: false, isToday: false };
  }
  return { text: `${diffDays} days left`, isOverdue: false, isToday: false };
};

/**
 * Capitalise the first letter of a string.
 */
export const capitalise = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get a greeting based on current time of day.
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Sort tasks by the chosen criterion.
 * Returns a new array (immutable).
 */
export const sortTasks = (tasks, sortBy) => {
  const sorted = [...tasks];
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  switch (sortBy) {
    case 'priority':
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case 'due_date':
      return sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'created_at':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

/**
 * Calculate completion statistics for the dashboard.
 */
export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(
    (t) => !t.completed && t.dueDate && getDaysRemaining(t.dueDate).isOverdue
  ).length;
  const dueToday = tasks.filter(
    (t) => !t.completed && t.dueDate && getDaysRemaining(t.dueDate).isToday
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, active, overdue, dueToday, completionRate };
};
