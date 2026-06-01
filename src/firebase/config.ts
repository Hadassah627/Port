import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config provided by user
const firebaseConfig = {
  apiKey: "AIzaSyCcCBuPuRuto6pF9H5D8DjQkQ6RJY6gfls",
  authDomain: "port-3fdeb.firebaseapp.com",
  projectId: "port-3fdeb",
  storageBucket: "port-3fdeb.firebasestorage.app",
  messagingSenderId: "515855704970",
  appId: "1:515855704970:web:683ec5c329b3c16adbde73",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const firebaseApp = app;
