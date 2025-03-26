import useAuth from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

export default function UnauthenticatedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Outlet />;
  }

  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  const roleRoutes: Record<string, string> = {
    admin: '/admin/dashboard',
    worker: '/worker',
    customer: '/customer',
  };

  return <Navigate to={roleRoutes[user.role] || '/'} replace />;
}
