import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '@/contexts/AuthContext';

export default function AdminProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
