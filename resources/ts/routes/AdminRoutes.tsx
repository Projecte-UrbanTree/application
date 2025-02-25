import AdminLayout from '@/layouts/AdminLayout';
import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';

import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminUsers from '@/pages/Admin/Settings/User/Users';
import CreateUser from "@/pages/Admin/Settings/User/Create";
import AdminContracts from '@/pages/Admin/Settings/Contracts';
import AdminWorkOrders from '@/pages/Admin/WorkOrders';
import AdminElementTypes from '@/pages/Admin/Settings/ElementTypes';
import AdminTreeTypes from '@/pages/Admin/Settings/TreeTypes';
import AdminTaskTypes from '@/pages/Admin/Settings/TaskTypes';
import AdminInventory from '@/pages/Admin/Inventory';
import AdminWorkers from '@/pages/Admin/Workers';
import AdminResources from '@/pages/Admin/Resources';
import AdminResourceTypes from '@/pages/Admin/Settings/ResourceTypes';
import AdminStats from '@/pages/Admin/Stats';

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
                path: 'users/create',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.users.create.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <CreateUser />
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
