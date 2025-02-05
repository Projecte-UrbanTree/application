import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminProtectedRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
