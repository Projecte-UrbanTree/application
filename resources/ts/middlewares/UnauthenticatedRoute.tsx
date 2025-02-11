import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '@/contexts/AuthContext';

export default function UnauthenticatedRoute() {
  const { isAuthenticated } = useAuthContext();

  return !isAuthenticated ? <Outlet /> : <Navigate to="/admin/dashboard" />;
}
