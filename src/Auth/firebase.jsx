// firebase.jsx
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import firestore module
import { getAuth } from "firebase/auth";
// Firebase is available after the script is loaded
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
let firestore; // Declare firestore variable

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app); // Initialize firestore
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { auth, firestore, AuthContext }; // Export firestore along with auth and AuthContext
