import AdminLayout from '@/layouts/AdminLayout';
import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';

import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminUsers from '@/pages/Admin/Users';
import AdminContracts from '@/pages/Admin/Contracts';
import AdminWorkOrders from '@/pages/Admin/WorkOrders';
import AdminElementTypes from '@/pages/Admin/ElementTypes';
import AdminTreeTypes from '@/pages/Admin/TreeTypes';
import AdminTaskTypes from '@/pages/Admin/TaskTypes';
import AdminResources from '@/pages/Admin/Resources';
import AdminResourceTypes from '@/pages/Admin/ResourceTypes';
import AdminStats from '@/pages/Admin/Stats';

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
      {
        path: '/admin/contracts',
        element: (
          <AdminLayout
            title="Contracts"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminContracts />
          </AdminLayout>
        ),
      },
      {
        path: '/admin/work-orders',
        element: (
          <AdminLayout
            title="Work Orders"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminWorkOrders />
          </AdminLayout>
        ),
      },
      {
        path: '/admin/element-types',
        element: (
          <AdminLayout
            title="Element Types"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminElementTypes />
          </AdminLayout>
        ),
      },
      {
        path: '/admin/tree-types',
        element: (
          <AdminLayout
            title="Tree Types"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminTreeTypes />
          </AdminLayout>
        ),
      },
      {
        path: '/admin/task-types',
        element: (
          <AdminLayout
            title="Task Types"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminTaskTypes />
          </AdminLayout>
        ),
      },
      {
        path: '/admin/resources',
        element: (
          <AdminLayout
            title="Resources"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminResources />
          </AdminLayout>
        ),
      },
      {
        path: '/admin/resource-types',
        element: (
          <AdminLayout
            title="Resource Types"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminResourceTypes />
          </AdminLayout>
        ),
      },
      {
        path: '/admin/stats',
        element: (
          <AdminLayout
            title="Stats"
            contracts={[{ id: '1', name: 'Tortosa' }]}
            currentContract={'1'}>
            <AdminStats />
          </AdminLayout>
        ),
      },
    ],
  },
];

export default AdminRoutes;
