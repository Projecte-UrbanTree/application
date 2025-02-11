import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Error404 from '@/pages/Error/404';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/Admin/Dashboard';

import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';

import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';
import UnauthenticatedRoute from '@/middlewares/UnauthenticatedRoute';

export default function AppRoutes() {
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
                contracts={[]}
                currentContract={'Testing'}
                currentPath="">
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
