/**
 * Application Constants
 *
 * Centralised string literals and enumerations used throughout the app.
 * Keeping them here avoids magic strings, simplifies future localisation,
 * and makes the codebase easier to maintain.
 */

// AsyncStorage keys — prefixed to avoid collisions
export const STORAGE_KEYS = {
  USER_DATA: '@ssp_user_data',
  TASKS: '@ssp_tasks',
  SETTINGS: '@ssp_settings',
  AUTH_TOKEN: '@ssp_auth_token',
};

// Task priority levels with display metadata
export const PRIORITIES = {
  HIGH: { key: 'high', label: 'High', color: '#E17055', icon: 'alert-circle' },
  MEDIUM: { key: 'medium', label: 'Medium', color: '#FDCB6E', icon: 'alert-triangle' },
  LOW: { key: 'low', label: 'Low', color: '#00B894', icon: 'chevrons-down' },
};

// Predefined module list for the student planner
export const MODULES = [
  'Mobile App Development',
  'Data Structures & Algorithms',
  'Software Engineering',
  'Database Systems',
  'Artificial Intelligence',
  'Web Development',
  'Computer Networks',
  'Cyber Security',
  'Other',
];

// Filter / sort options for task lists
export const FILTER_OPTIONS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export const SORT_OPTIONS = {
  DUE_DATE: 'due_date',
  PRIORITY: 'priority',
  TITLE: 'title',
  CREATED: 'created_at',
};

// Validation constraints
export const VALIDATION = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  NOTES_MAX: 500,
  PASSWORD_MIN: 6,
  NAME_MIN: 2,
};

// Screen names — single source of truth for navigation
export const SCREENS = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  DASHBOARD: 'Dashboard',
  TASK_LIST: 'TaskList',
  ADD_TASK: 'AddTask',
  EDIT_TASK: 'EditTask',
  TASK_DETAIL: 'TaskDetail',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};
