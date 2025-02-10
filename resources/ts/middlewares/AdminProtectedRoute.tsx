import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
