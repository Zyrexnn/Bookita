import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuthStatus() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Check if auth is available
    if (!auth) {
      console.error('Firebase auth is not available');
      setFirebaseError('Firebase authentication is not available');
      setLoading(false);
      return;
    }

    setFirebaseReady(true);
    
    // onAuthStateChanged is the main listener for all auth status changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      console.log("Auth state changed:", user ? "User logged in" : "No user");
    }, (error) => {
      console.error("Auth state change error:", error);
      setFirebaseError(error.message);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener when component unmounts
  }, []);

  return { currentUser, loading, firebaseReady, firebaseError };
}

export function useRequireAuth() {
  const { currentUser, loading, firebaseReady, firebaseError } = useAuthStatus();

  if (loading || !firebaseReady) {
    return { 
      currentUser: null, 
      loading: true, 
      isAuthenticated: false, 
      firebaseReady: false,
      firebaseError: null 
    };
  }

  if (firebaseError) {
    return { 
      currentUser: null, 
      loading: false, 
      isAuthenticated: false, 
      firebaseReady: true,
      firebaseError 
    };
  }

  if (!currentUser) {
    return { 
      currentUser: null, 
      loading: false, 
      isAuthenticated: false, 
      firebaseReady: true,
      firebaseError: null 
    };
  }

  return { 
    currentUser, 
    loading: false, 
    isAuthenticated: true, 
    firebaseReady: true,
    firebaseError: null 
  };
}