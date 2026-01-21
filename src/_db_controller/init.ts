// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider 
} from "firebase/auth";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { app, db, auth, analytics };

// Initialize alternate sign-in providers authentication
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');