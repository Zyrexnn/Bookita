import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Only initialize Firebase on client side
const isClient = typeof window !== 'undefined';

let app;
let auth;
let analytics;

if (isClient) {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAtYPdoZk7FC99AjAtDFOgXs_rzloDtjqk",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "linklogin-fa154.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "linklogin-fa154",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "linklogin-fa154.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "818436929155",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:818436929155:web:8644a5d578bce8f9df4db6",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YB9F0S1V26"
  };

  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    
    // Initialize Analytics only on client side
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Don't throw error, just log it and continue with null values
  }
}

export { auth, app, analytics };