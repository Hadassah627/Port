import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { UserProfile } from '../types/content';

export const loginWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

export const watchAuth = (callback: Parameters<typeof onAuthStateChanged>[1]) =>
  onAuthStateChanged(auth, callback);

export const loadUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(db, 'users', uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Omit<UserProfile, 'uid'>;

  return {
    uid,
    email: data.email,
    displayName: data.displayName,
    role: data.role,
    photoUrl: data.photoUrl,
  };
};