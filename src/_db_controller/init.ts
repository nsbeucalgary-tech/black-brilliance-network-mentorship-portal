// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_DB_APIKEY,
//     authDomain: import.meta.env.VITE_DB_AUTHDOMAIN,
//     projectId: import.meta.env.VITE_DB_PROJECTID,
//     storageBucket: import.meta.env.VITE_DB_STORAGEBUCKET,
//     messagingSenderId: import.meta.env.VITE_DB_MESSAGINGSENDERID,
//     appId: import.meta.env.VITE_DB_APIID,
//     measurementId: import.meta.env.VITE_DB_MEASUREMENTID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const analytics = getAnalytics(app);
// export { app, db, analytics };

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase config pulled from Vite env vars.
 * NOTE: If any required values are missing (especially projectId),
 * Firebase will crash at runtime — so we guard in dev.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_DB_APIKEY,
  authDomain: import.meta.env.VITE_DB_AUTHDOMAIN,
  projectId: import.meta.env.VITE_DB_PROJECTID,
  storageBucket: import.meta.env.VITE_DB_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_DB_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_DB_APIID,
  measurementId: import.meta.env.VITE_DB_MEASUREMENTID,
};

// Hard requirement for Firebase to initialize correctly
const hasRequiredConfig = Boolean(firebaseConfig.projectId);

// Only initialize if config exists, otherwise throw a clear error in dev
if (!hasRequiredConfig) {
  // This prevents a confusing Firebase Installations crash.
  // You can remove this once env vars are set.
  console.error(
    "Firebase config missing. Check .env for VITE_DB_PROJECTID (and other VITE_DB_* vars)."
  );
}

// Initialize Firebase (won’t crash if config missing because we avoid calling it)
const app = hasRequiredConfig ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

/**
 * Analytics can crash if run without proper config or unsupported environment.
 * So we only init it when supported + app exists.
 */
let analytics: any = null;
if (app) {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {
      // ignore analytics in unsupported environments
    });
}

export { app, db, analytics };
