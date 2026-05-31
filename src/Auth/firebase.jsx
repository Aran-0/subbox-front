// firebase.jsx
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLve0BD-ZR7phN_MMK519PpfjjG6nRi3M",
  authDomain: "subbox-5cbf5.firebaseapp.com",
  projectId: "subbox-5cbf5",
  storageBucket: "subbox-5cbf5.firebasestorage.app",
  messagingSenderId: "526420750460",
  appId: "1:526420750460:web:3dd70e545d531a801e59f9",
  measurementId: "G-V61JF8ZR3Q",
};

let app;
let auth;
let firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setCurrentUser(null);
      setError(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    logout,
    loading,
    error,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { auth, firestore, AuthContext };
