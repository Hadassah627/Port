import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, type DocumentData, type QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useCollectionQuery = <T extends DocumentData>(
  key: string[],
  path: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    const ref = collection(db, path);
    // Use constraint serialization in key, but constraints array in query
    const q = query(ref, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as T),
        }));
        setData(docs);
        setIsLoading(false);
      },
      (err) => {
        console.error('useCollectionQuery error:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path, JSON.stringify(constraints)]);

  return { data, isLoading, error, isFetching: false };
};