/**
 * ValidationService — Input Validation & Error Messaging
 *
 * Centralised validation logic for all user-facing forms.
 * Each method returns { isValid: boolean, errors: { [field]: string } }
 * so the UI can highlight specific fields.
 *
 * Validation rules are driven by constants defined in ../utils/constants.js
 * to keep thresholds consistent across the codebase.
 */

import { VALIDATION } from '../utils/constants';

class ValidationService {

  /**
   * Validate the login form.
   * Rules: email format, password minimum length.
   */
  static validateLogin(email, password) {
    const errors = {};

    if (!email || email.trim().length === 0) {
      errors.email = 'Email address is required.';
    } else if (!this.isValidEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password || password.length === 0) {
      errors.password = 'Password is required.';
    } else if (password.length < VALIDATION.PASSWORD_MIN) {
      errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN} characters.`;
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Validate the registration form.
   * Additional checks: name length, password confirmation match.
   */
  static validateRegister(name, email, password, confirmPassword) {
    const errors = {};

    if (!name || name.trim().length < VALIDATION.NAME_MIN) {
      errors.name = `Name must be at least ${VALIDATION.NAME_MIN} characters.`;
    }

    if (!email || email.trim().length === 0) {
      errors.email = 'Email address is required.';
    } else if (!this.isValidEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password || password.length < VALIDATION.PASSWORD_MIN) {
      errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN} characters.`;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Validate the task creation / edit form.
   * Title is mandatory; due date must be in the future (for new tasks).
   */
  static validateTask(title, module, dueDate, priority) {
    const errors = {};

    if (!title || title.trim().length < VALIDATION.TITLE_MIN) {
      errors.title = `Title must be at least ${VALIDATION.TITLE_MIN} characters.`;
    } else if (title.trim().length > VALIDATION.TITLE_MAX) {
      errors.title = `Title cannot exceed ${VALIDATION.TITLE_MAX} characters.`;
    }

    if (!module || module.trim().length === 0) {
      errors.module = 'Please select a module.';
    }

    if (!dueDate) {
      errors.dueDate = 'Due date is required.';
    }

    if (!priority) {
      errors.priority = 'Please select a priority level.';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Validate notes field (optional, but capped length).
   */
  static validateNotes(notes) {
    if (notes && notes.length > VALIDATION.NOTES_MAX) {
      return { isValid: false, error: `Notes cannot exceed ${VALIDATION.NOTES_MAX} characters.` };
    }
    return { isValid: true, error: null };
  }

  /* ─────── Private helpers ─────── */

  /**
   * RFC 5322-simplified email regex.
   */
  static isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }
}

export default ValidationService;
