import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export default function UnauthenticatedRoute() {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? <Outlet /> : <Navigate to="/admin/dashboard" />;
}
