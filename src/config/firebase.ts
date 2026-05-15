import { initializeApp, getApps } from "firebase/app";
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
 * Initialize Firebase App (only if not already initialized)
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

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
