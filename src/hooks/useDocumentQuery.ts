import { useQuery } from '@tanstack/react-query';
import { getDocument } from '../services/firestore';
import type { DocumentData } from 'firebase/firestore';

export const useDocumentQuery = <T extends DocumentData>(key: string[], path: string, id: string) =>
  useQuery({
    queryKey: key,
    queryFn: () => getDocument<T>(path, id),
  });