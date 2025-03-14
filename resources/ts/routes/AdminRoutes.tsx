import AdminLayoutWrapper from '@/components/Admin/Dashboard/AdminDashboardWrapper';
import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';

import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminInventory from '@/pages/Admin/Inventory';
import AdminContracts from '@/pages/Admin/Settings/Contracts/Contracts';
import CreateContract from '@/pages/Admin/Settings/Contracts/Create';
import EditContract from '@/pages/Admin/Settings/Contracts/Edit';
import AdminElementTypes from '@/pages/Admin/Settings/Element Types/ElementTypes';
import CreateResourceType from '@/pages/Admin/Settings/Resource Types/Create';
import EditResourceType from '@/pages/Admin/Settings/Resource Types/Edit';
import AdminResourceTypes from '@/pages/Admin/Settings/Resource Types/ResourceTypes';
import CreateResource from '@/pages/Admin/Settings/Resources/Create';
import EditResource from '@/pages/Admin/Settings/Resources/Edit';
import AdminResources from '@/pages/Admin/Settings/Resources/Resources';
import CreateTaskType from '@/pages/Admin/Settings/Task Types/Create';
import EditTaskType from '@/pages/Admin/Settings/Task Types/Edit';
import AdminTaskTypes from '@/pages/Admin/Settings/Task Types/TaskTypes';
import CreateTreeType from '@/pages/Admin/Settings/Tree Types/Create';
import EditTreeType from '@/pages/Admin/Settings/Tree Types/Edit';
import AdminTreeTypes from '@/pages/Admin/Settings/Tree Types/TreeTypes';
import CreateUser from '@/pages/Admin/Settings/Users/Create';
import EditUser from '@/pages/Admin/Settings/Users/Edit';
import AdminUsers from '@/pages/Admin/Settings/Users/Users';
import AdminStats from '@/pages/Admin/Statistics';
import AdminWorkers from '@/pages/Admin/Workers';
import CreateWorkOrder from '@/pages/Admin/WorkOrders/Create';
import EditWorkOrder from '@/pages/Admin/WorkOrders/Edit';
import AdminWorkOrders from '@/pages/Admin/WorkOrders/WorkOrders';
import WorkReport from '@/pages/Admin/WorkReport';
import Account from '@/pages/Admin/Account/Account';

import { Navigate, RouteObject } from 'react-router-dom';

const AdminRoutes: RouteObject[] = [
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: '/admin',
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" />,
          },
          {
            path: 'dashboard',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.dashboard.title">
                <AdminDashboard />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'work-orders',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.workOrders.title">
                <AdminWorkOrders />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'work-orders/create',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.workOrders.create.title">
                <CreateWorkOrder />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'work-orders/edit/:id',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.workOrders.edit.title">
                <EditWorkOrder />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'work-reports/:id',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.workOrders.edit.title">
                <WorkReport />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'inventory',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.inventory.title">
                <AdminInventory />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'workers',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.workers.title">
                <AdminWorkers />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'resources',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.resources.title">
                <AdminResources />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'resources/create',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.resources.create.title">
                <CreateResource />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'resources/edit/:id',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.resources.edit.title">
                <EditResource />
              </AdminLayoutWrapper>
            ),
          },
          {
            path: 'statistics',
            element: (
              <AdminLayoutWrapper titleI18n="admin.pages.stats.title">
                <AdminStats />
              </AdminLayoutWrapper>
            ),
          },
                    {
                        path: 'account',
                        element: (
                            <AdminLayoutWrapper titleI18n="admin.pages.account.title">
                                <Account />
                            </AdminLayoutWrapper>
                        ),
                    },
          {
            path: 'settings',
            children: [
              {
                index: true,
                element: <Navigate to="/admin/settings/users" />,
              },
              {
                path: 'users',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.users.title">
                    <AdminUsers />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'users/create',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.users.create.title">
                    <CreateUser />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'users/edit/:id',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.users.edit.title">
                    <EditUser />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'contracts',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.contracts.title">
                    <AdminContracts />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'contracts/create',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.contracts.create.title">
                    <CreateContract />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'contracts/edit/:id',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.contracts.edit.title">
                    <EditContract />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'element-types',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.elementTypes.title">
                    <AdminElementTypes />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'tree-types',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.treeTypes.title">
                    <AdminTreeTypes />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'tree-types/create',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.treeTypes.create.title">
                    <CreateTreeType />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'tree-types/edit/:id',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.treeTypes.edit.title">
                    <EditTreeType />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'tree-types/create',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.treeTypes.create.title">
                    <CreateTreeType />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'tree-types/edit/:id',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.treeTypes.edit.title">
                    <EditTreeType />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'task-types',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.taskTypes.title">
                    <AdminTaskTypes />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'task-types/create',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.taskTypes.create.title">
                    <CreateTaskType />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'task-types/edit/:id',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.taskTypes.edit.title">
                    <EditTaskType />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'resource-types',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.resourceTypes.title">
                    <AdminResourceTypes />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'resource-types/create',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.resourceTypes.create.title">
                    <CreateResourceType />
                  </AdminLayoutWrapper>
                ),
              },
              {
                path: 'resource-types/edit/:id',
                element: (
                  <AdminLayoutWrapper titleI18n="admin.pages.resourceTypes.edit.title">
                    <EditResourceType />
                  </AdminLayoutWrapper>
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
