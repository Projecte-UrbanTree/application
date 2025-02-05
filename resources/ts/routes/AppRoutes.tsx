import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Error404 from '@/pages/Error/404';

import Login from '@/pages/Login';

import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Redirect to login page if no route matches */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}
