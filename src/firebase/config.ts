import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase config provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCcCBuPuRuto6pF9H5D8DjQkQ6RJY6gfls",
  authDomain: "port-3fdeb.firebaseapp.com",
  projectId: "port-3fdeb",
  storageBucket: "port-3fdeb.firebasestorage.app",
  messagingSenderId: "515855704970",
  appId: "1:515855704970:web:683ec5c329b3c16adbde73",
  measurementId: "G-68Z1D0G7E7",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Analytics in browser (guarded to avoid SSR errors)
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // ignore analytics initialization errors
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const firebaseApp = app;
export { analytics };