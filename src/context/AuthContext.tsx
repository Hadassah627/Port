import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { loadUserProfile, loginWithEmail, logout, watchAuth } from '../services/auth';
import type { UserProfile } from '../types/content';

type AuthContextValue = {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      watchAuth((user) => {
        setFirebaseUser(user);

        if (!user) {
          setUserProfile(null);
          setLoading(false);
          return;
        }

        const profilePromise = loadUserProfile(user.uid);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Session timeout')), 7000)
        );

        Promise.race([profilePromise, timeoutPromise])
          .then((profile) => {
            setUserProfile(profile);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Profile loading error or timeout:', error);
            setUserProfile(null);
            setLoading(false);
          });
      }),
    []
  );

  const value = useMemo<AuthContextValue>(() => ({
    firebaseUser,
    userProfile,
    loading,
    login: async (email, password) => {
      setLoading(true);
      try {
        const userCredential = await loginWithEmail(email, password);
        const profile = await loadUserProfile(userCredential.user.uid);

        if (!profile || profile.role !== 'admin') {
          throw new Error('Unauthorized: Admin role required.');
        }

        setFirebaseUser(userCredential.user);
        setUserProfile(profile);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    signOut: async () => {
      await logout();
    },
    isAdmin: userProfile?.role === 'admin',
  }), [firebaseUser, loading, userProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};