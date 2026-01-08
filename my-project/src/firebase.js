// src/firebase.js
// Note: Firebase configuration is not currently used in the application
// The app uses JWT tokens for authentication instead
// To use Firebase, configure the credentials below and implement Firebase auth methods

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  // Configure your Firebase project credentials here
  // Get these from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Only initialize if config is complete
let app;
let auth;
let googleProvider;

if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else {
  console.warn('Firebase is not fully configured. Using backend JWT authentication instead.');
}

export { app, auth, googleProvider };
