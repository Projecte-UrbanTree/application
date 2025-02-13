import AdminLayout from '@/layouts/AdminLayout';
import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';

import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminUsers from '@/pages/Admin/Users';

import { useI18n } from '@/hooks/useI18n';

import { RouteObject } from 'react-router-dom';

const AdminRoutes: RouteObject[] = [
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: '/admin/dashboard',
        element: (
          <AdminLayout
            title="Dashboard"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminDashboard />
          </AdminLayout>
        ),
      },
      {
        path: '/admin/users',
        element: (
          <AdminLayout
            title="Users"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminUsers />
          </AdminLayout>
        ),
      },
    ],
  },
];

export default AdminRoutes;
