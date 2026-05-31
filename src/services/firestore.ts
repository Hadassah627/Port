import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const collectionRef = (path: string) => collection(db, path);

export const getCollectionDocuments = async <T extends DocumentData>(path: string, constraints: QueryConstraint[] = []) => {
  const snapshot = await getDocs(query(collectionRef(path), ...constraints));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as T) }));
};

export const getDocument = async <T extends DocumentData>(path: string, id: string) => {
  const snapshot = await getDoc(doc(db, path, id));
  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...(snapshot.data() as T) };
};

export const createDocument = async <T extends DocumentData>(path: string, data: T, id?: string) => {
  if (id) {
    await setDoc(doc(db, path, id), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  }

  const result = await addDoc(collectionRef(path), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return result.id;
};

export const updateDocument = async <T extends DocumentData>(path: string, id: string, data: Partial<T>) =>
  updateDoc(doc(db, path, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });

export const deleteDocument = async (path: string, id: string) => deleteDoc(doc(db, path, id));

export const submitMessage = async (data: Record<string, unknown>) => createDocument('messages', data);

export const buildQuery = {
  orderBy,
  limit,
  where,
};