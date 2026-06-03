/**
 * StorageService — Local Data Persistence Layer
 *
 * Wraps AsyncStorage to provide a clean API for saving and loading
 * application data (user profile, tasks, settings).
 *
 * Design decisions:
 *   - All data is JSON-serialised before storage.
 *   - Every write is atomic: the entire collection is replaced to prevent
 *     partial-write corruption.
 *   - Error boundaries catch and log storage failures without crashing the app.
 *
 * This module is the single point of contact for persistence, making it easy
 * to swap AsyncStorage for SQLite or a remote API in a future iteration.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

class StorageService {

  /* ─────────────── Generic helpers ─────────────── */

  /**
   * Store a JSON-serialisable value under the given key.
   * @returns {boolean} true on success
   */
  static async save(key, value) {
    try {
      const json = JSON.stringify(value);
      await AsyncStorage.setItem(key, json);
      return true;
    } catch (error) {
      console.error(`[StorageService] save(${key}) failed:`, error);
      return false;
    }
  }

  /**
   * Retrieve and parse a stored value.
   * Returns null when the key doesn't exist or parsing fails.
   */
  static async load(key) {
    try {
      const json = await AsyncStorage.getItem(key);
      return json != null ? JSON.parse(json) : null;
    } catch (error) {
      console.error(`[StorageService] load(${key}) failed:`, error);
      return null;
    }
  }

  /**
   * Remove a single key.
   */
  static async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[StorageService] remove(${key}) failed:`, error);
      return false;
    }
  }

  /**
   * Remove all app-specific keys (used on logout / account reset).
   */
  static async clearAll() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error('[StorageService] clearAll failed:', error);
      return false;
    }
  }

  /* ─────────────── User data ─────────────── */

  static async saveUser(userData) {
    return this.save(STORAGE_KEYS.USER_DATA, userData);
  }

  static async getUser() {
    return this.load(STORAGE_KEYS.USER_DATA);
  }

  /* ─────────────── Tasks ─────────────── */

  static async saveTasks(tasks) {
    return this.save(STORAGE_KEYS.TASKS, tasks);
  }

  static async getTasks() {
    const tasks = await this.load(STORAGE_KEYS.TASKS);
    return tasks || []; // always return an array
  }

  /* ─────────────── Settings ─────────────── */

  static async saveSettings(settings) {
    return this.save(STORAGE_KEYS.SETTINGS, settings);
  }

  static async getSettings() {
    const settings = await this.load(STORAGE_KEYS.SETTINGS);
    return settings || { notifications: true, darkMode: false, sortBy: 'due_date' };
  }
}

export default StorageService;
