import AdminLayout from '@/layouts/AdminLayout';
import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';

import AdminDashboard from '@/pages/admin/dashboard';
import AdminUsers from '@/pages/admin/settings/users';
import AdminContracts from '@/pages/admin/settings/contracts';
import AdminWorkOrders from '@/pages/admin/work-orders';
import AdminElementTypes from '@/pages/admin/settings/element-types';
import AdminTreeTypes from '@/pages/admin/settings/tree-types';
import AdminTaskTypes from '@/pages/admin/settings/task-types';
import AdminInventory from '@/pages/admin/inventory';
import AdminWorkers from '@/pages/admin/workers';
import AdminResources from '@/pages/admin/resources';
import AdminResourceTypes from '@/pages/admin/settings/resource-types';
import AdminStats from '@/pages/admin/stats';

import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';

const AdminRoutes: RouteObject[] = [
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: '/admin',
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" /> },
          {
            path: 'dashboard',
            element: (
              <AdminLayout
                titleI18n="admin.pages.dashboard.title"
                contracts={[{ id: '1', name: 'Tortosa' }]}
                currentContract={'1'}>
                <AdminDashboard />
              </AdminLayout>
            ),
          },
          {
            path: 'work-orders',
            element: (
              <AdminLayout
                titleI18n="admin.pages.workOrders.title"
                contracts={[{ id: '1', name: 'Tortosa' }]}
                currentContract={'1'}>
                <AdminWorkOrders />
              </AdminLayout>
            ),
          },
          {
            path: 'inventory',
            element: (
              <AdminLayout
                titleI18n="admin.pages.inventory.title"
                contracts={[{ id: '1', name: 'Tortosa' }]}
                currentContract={'1'}>
                <AdminInventory />
              </AdminLayout>
            ),
          },
          {
            path: 'workers',
            element: (
              <AdminLayout
                titleI18n="admin.pages.workers.title"
                contracts={[{ id: '1', name: 'Tortosa' }]}
                currentContract={'1'}>
                <AdminWorkers />
              </AdminLayout>
            ),
          },
          {
            path: 'resources',
            element: (
              <AdminLayout
                titleI18n="admin.pages.resources.title"
                contracts={[{ id: '1', name: 'Tortosa' }]}
                currentContract={'1'}>
                <AdminResources />
              </AdminLayout>
            ),
          },
          {
            path: 'stats',
            element: (
              <AdminLayout
                titleI18n="admin.pages.stats.title"
                contracts={[{ id: '1', name: 'Tortosa' }]}
                currentContract={'1'}>
                <AdminStats />
              </AdminLayout>
            ),
          },
          {
            path: 'settings',
            children: [
              { index: true, element: <Navigate to="/admin/settings/users" /> },
              {
                path: 'users',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.users.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <AdminUsers />
                  </AdminLayout>
                ),
              },
              {
                path: 'contracts',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.contracts.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <AdminContracts />
                  </AdminLayout>
                ),
              },
              {
                path: 'element-types',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.elementTypes.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <AdminElementTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'tree-types',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.treeTypes.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <AdminTreeTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'task-types',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.taskTypes.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <AdminTaskTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'resource-types',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.resourceTypes.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <AdminResourceTypes />
                  </AdminLayout>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
];

export default AdminRoutes;
