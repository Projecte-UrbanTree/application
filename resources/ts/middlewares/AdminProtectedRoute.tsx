import Preloader from '@/components/Preloader';
import useAuth from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router';

export default function AdminProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Preloader />;
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
