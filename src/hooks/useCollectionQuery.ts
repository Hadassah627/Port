import { useQuery } from '@tanstack/react-query';
import { getCollectionDocuments } from '../services/firestore';
import type { DocumentData, QueryConstraint } from 'firebase/firestore';

export const useCollectionQuery = <T extends DocumentData>(
  key: string[],
  path: string,
  constraints: QueryConstraint[] = []
) =>
  useQuery({
    queryKey: key,
    queryFn: () => getCollectionDocuments<T>(path, constraints),
  });