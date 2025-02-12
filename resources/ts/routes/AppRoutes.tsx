import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Error404 from '@/pages/Error/404';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/Admin/Dashboard';

import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';

import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';
import UnauthenticatedRoute from '@/middlewares/UnauthenticatedRoute';

import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';

import Preloader from '@/components/Preloader';

export default function AppRoutes() {
  const { isLoading } = useAuth();
  const { t } = useI18n();
  if (isLoading) {
    return <Preloader />;
  }
  return (
    <Router>
      <Routes>
        <Route element={<UnauthenticatedRoute />}>
          <Route
            path="/login"
            element={
              <AuthLayout title="Login">
                <Login />
              </AuthLayout>
            }
          />
        </Route>
        {/* Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout
                title="Dashboard"
                contracts={[
                  { id: '1', name: 'Tortosa' },
                  { id: '-1', name: t('general.allContracts') },
                ]}
                currentContract={'1'}>
                <AdminDashboard />
              </AdminLayout>
            }
          />
        </Route>

        {/* Redirect to login page if no route matches */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}
