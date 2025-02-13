import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '@/contexts/AuthContext';

export default function UnauthenticatedRoute() {
  const { isAuthenticated, user } = useAuthContext();

  return !isAuthenticated ? (
    <Outlet />
  ) : user?.role === 'admin' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : user?.role === 'worker' ? (
    <Navigate to="/worker" replace />
  ) : (
    <Navigate to="/customer" replace />
  );
}
