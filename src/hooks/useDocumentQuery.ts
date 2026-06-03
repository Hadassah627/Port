import { useEffect, useState } from 'react';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useDocumentQuery = <T extends DocumentData>(
  key: string[],
  path: string,
  id: string
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, path, id),
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...(snapshot.data() as T) });
        } else {
          setData(null);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('useDocumentQuery error:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path, id]);

  return { data, isLoading, error, isFetching: false };
};