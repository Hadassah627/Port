import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { firebaseUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-ink-950 text-white" />;
  }

  if (!firebaseUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};