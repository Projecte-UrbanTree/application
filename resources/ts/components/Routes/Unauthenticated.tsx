import useAuth from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';
import Preloader from '../Preloader';

export default function UnauthenticatedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Preloader bg_white={true} />;

  if (!user) return <Outlet />;

  const roleRoutes = {
    admin: '/admin/dashboard',
    worker: '/app',
    customer: '/app',
  };

  return (
    <Navigate to={user.role ? roleRoutes[user.role] || '/' : '/'} replace />
  );
}
