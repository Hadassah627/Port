import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { firebaseUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gold-300 border-t-transparent" />
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-gold-300 animate-pulse">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};