// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_DB_APIKEY,
    authDomain: import.meta.env.VITE_DB_AUTHDOMAIN,
    projectId: import.meta.env.VITE_DB_PROJECTID,
    storageBucket: import.meta.env.VITE_DB_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_DB_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_DB_APIID,
    measurementId: import.meta.env.VITE_DB_MEASUREMENTID,
};
const hasFirebaseConfig =
    !!firebaseConfig.apiKey &&
    !!firebaseConfig.authDomain &&
    !!firebaseConfig.projectId &&
    !!firebaseConfig.appId;

// Don’t crash the whole app if config is missing locally
export const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;

// Firestore should also be optional if config is missing
export const db = app ? getFirestore(app) : null;

//
export async function initAnalytics() {
    // Skip analytics in dev OR when config is missing
    if (import.meta.env.DEV) return;
    if (!app) return;
    if (!firebaseConfig.measurementId) return;

    const ok = await isSupported();
    if (ok) getAnalytics(app);
}