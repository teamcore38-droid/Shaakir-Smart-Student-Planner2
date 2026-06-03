/**
 * AuthContext — Authentication State Management (Firebase Integration)
 *
 * Implements authentication using Firebase Auth.
 * Provides login, register, logout, and profile-update actions through
 * React Context so any screen can access auth state without prop drilling.
 *
 * Session Persistence: Configured automatically via Firebase Auth and
 * local AsyncStorage integration.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile as updateFirebaseProfile, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import ValidationService from '../services/ValidationService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount: set up Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user fields to application schema
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  /**
   * Register a new user with Firebase Auth.
   */
  const register = async (name, email, password, confirmPassword) => {
    setError(null);
    const validation = ValidationService.validateRegister(name, email, password, confirmPassword);
    if (!validation.isValid) {
      setError(validation.errors);
      return { success: false, errors: validation.errors };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const firebaseUser = userCredential.user;

      // Update user display name in Firebase Auth profile
      await updateFirebaseProfile(firebaseUser, {
        displayName: name.trim(),
      });

      const appUser = {
        id: firebaseUser.uid,
        name: name.trim(),
        email: firebaseUser.email,
      };

      setUser(appUser);
      return { success: true };
    } catch (err) {
      console.error('[AuthContext] Registration failed:', err);
      let errorMsg = { general: 'Registration failed. Please try again.' };
      
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = { email: 'That email address is already in use.' };
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = { email: 'That email address is invalid.' };
      } else if (err.code === 'auth/weak-password') {
        errorMsg = { password: 'The password is too weak (Min. 6 chars).' };
      }
      
      setError(errorMsg);
      return { success: false, errors: errorMsg };
    }
  };

  /**
   * Log in with Firebase Auth.
   */
  const login = async (email, password) => {
    setError(null);
    const validation = ValidationService.validateLogin(email, password);
    if (!validation.isValid) {
      setError(validation.errors);
      return { success: false, errors: validation.errors };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const firebaseUser = userCredential.user;
      
      const appUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
      };

      setUser(appUser);
      return { success: true };
    } catch (err) {
      console.error('[AuthContext] Login failed:', err);
      let errorMsg = { general: 'Login failed. Please check your credentials.' };
      
      if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/invalid-credential'
      ) {
        errorMsg = { general: 'Invalid email or password.' };
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = { email: 'That email address is invalid.' };
      }
      
      setError(errorMsg);
      return { success: false, errors: errorMsg };
    }
  };

  /**
   * Log out from Firebase Auth.
   */
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('[AuthContext] Logout failed:', err);
    }
  };

  /**
   * Update user display name in Firebase profile.
   */
  const updateProfile = async (updates) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'No active authenticated session.' };
      }

      if (updates.name) {
        await updateFirebaseProfile(currentUser, {
          displayName: updates.name.trim(),
        });
      }

      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          name: updates.name ? updates.name.trim() : prev.name,
        };
      });
      
      return { success: true };
    } catch (err) {
      console.error('[AuthContext] Update profile failed:', err);
      return { success: false, error: 'Failed to update profile.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
