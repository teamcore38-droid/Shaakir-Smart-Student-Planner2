/**
 * Firebase Config
 *
 * Configures connection to Firebase App, Firebase Authentication,
 * and Cloud Firestore Database. Sets up local React Native persistence.
 */

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Active Firebase project settings configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0Mtljo0afQ4-6pQ5MCArJBgiFnw3P0TI",
  authDomain: "shaakir-smart-student-planner.firebaseapp.com",
  projectId: "shaakir-smart-student-planner",
  storageBucket: "shaakir-smart-student-planner.firebasestorage.app",
  messagingSenderId: "941271193776",
  appId: "1:941271193776:web:772cef8d214e4716244375",
  measurementId: "G-D54N3XRVFC"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence to maintain logged-in state across restarts
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore Database
const db = getFirestore(app);

export { auth, db };
