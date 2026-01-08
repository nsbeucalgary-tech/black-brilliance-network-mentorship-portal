import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Firebase Configuration
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_DB_APIKEY || "",
  authDomain: import.meta.env.VITE_DB_AUTHDOMAIN || "",
  projectId: import.meta.env.VITE_DB_PROJECTID || "",
  storageBucket: import.meta.env.VITE_DB_STORAGEBUCKET || "",
  messagingSenderId: import.meta.env.VITE_DB_MESSAGINGSENDERID || "",
  appId: import.meta.env.VITE_DB_APIID || "",
};

/**
 * Initialize Firebase App
 */
const app = initializeApp(firebaseConfig);

/**
 * Initialize Firestore Database
 */
export const db: Firestore = getFirestore(app);

/**
 * Initialize Firebase Authentication
 */
export const auth: Auth = getAuth(app);

/**
 * Export the app instance
 */
export default app;
