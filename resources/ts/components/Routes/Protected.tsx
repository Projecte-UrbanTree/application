import Preloader from '@/components/Preloader';
import useAuth from '@/hooks/useAuth';
import type { Roles } from '@/types/Role';
import { isAuthTokenPresent } from '@/utils/auth';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: Roles[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // If we're still loading, show the preloader
  if (loading) return <Preloader bg_white={true} />;

  // If there's no user but there is a token, we should wait for authentication
  // instead of immediately redirecting to login
  if (!user && isAuthTokenPresent()) return <Preloader bg_white={true} />;

  // If there's no user and no token, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Role-based access check
  if (allowedRoles && user.role && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return <Outlet />;
}
