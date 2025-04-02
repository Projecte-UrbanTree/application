import ProtectedRoute from '@/components/Routes/Protected';
import AppLayout from '@/layouts/AppLayout';
import AdminDashboard from '@/pages/Admin/Dashboard';
import CreateEva from '@/pages/Admin/Eva/Create';
import EditEva from '@/pages/Admin/Eva/Edit';
import Eva from '@/pages/Admin/Eva/Eva';
import ShowEva from '@/pages/Admin/Eva/Show';
import AdminInventory from '@/pages/Admin/Inventory';
import AdminContracts from '@/pages/Admin/Settings/Contracts/Contracts';
import CreateContract from '@/pages/Admin/Settings/Contracts/Create';
import EditContract from '@/pages/Admin/Settings/Contracts/Edit';
import CreateElementTypes from '@/pages/Admin/Settings/ElementTypes/Create';
import EditElementTypes from '@/pages/Admin/Settings/ElementTypes/Edit';
import AdminElementTypes from '@/pages/Admin/Settings/ElementTypes/ElementTypes';
import CreateResource from '@/pages/Admin/Settings/Resources/Create';
import EditResource from '@/pages/Admin/Settings/Resources/Edit';
import AdminResources from '@/pages/Admin/Settings/Resources/Resources';
import CreateResourceType from '@/pages/Admin/Settings/ResourceTypes/Create';
import EditResourceType from '@/pages/Admin/Settings/ResourceTypes/Edit';
import AdminResourceTypes from '@/pages/Admin/Settings/ResourceTypes/ResourceTypes';
import CreateTaskType from '@/pages/Admin/Settings/TaskTypes/Create';
import EditTaskType from '@/pages/Admin/Settings/TaskTypes/Edit';
import AdminTaskTypes from '@/pages/Admin/Settings/TaskTypes/TaskTypes';
import CreateTreeType from '@/pages/Admin/Settings/TreeTypes/Create';
import EditTreeType from '@/pages/Admin/Settings/TreeTypes/Edit';
import AdminTreeTypes from '@/pages/Admin/Settings/TreeTypes/TreeTypes';
import CreateUser from '@/pages/Admin/Settings/Users/Create';
import EditUser from '@/pages/Admin/Settings/Users/Edit';
import AdminUsers from '@/pages/Admin/Settings/Users/Users';
import AdminStats from '@/pages/Admin/Statistics';
import AdminWorkers from '@/pages/Admin/Workers';
import CreateWorkOrder from '@/pages/Admin/WorkOrders/Create';
import EditWorkOrder from '@/pages/Admin/WorkOrders/Edit';
import AdminWorkOrders from '@/pages/Admin/WorkOrders/WorkOrders';
import WorkReport from '@/pages/Admin/WorkReport';
import { Roles } from '@/types/Role';

import { Navigate, type RouteObject } from 'react-router-dom';

export default [
  {
    element: <ProtectedRoute allowedRoles={[Roles.admin]} />,
    children: [
      {
        path: '/admin',
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: (
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            ),
          },
          {
            path: 'evas',
            element: (
              <AppLayout>
                <Eva />
              </AppLayout>
            ),
          },
          {
            path: 'evas/create',
            element: (
              <AppLayout>
                <CreateEva />
              </AppLayout>
            ),
          },
          {
            path: 'evas/edit/:id',
            element: (
              <AppLayout>
                <EditEva />
              </AppLayout>
            ),
          },
          {
            path: 'evas/:id',
            element: (
              <AppLayout>
                <ShowEva />
              </AppLayout>
            ),
          },
          {
            path: 'work-orders',
            element: (
              <AppLayout>
                <AdminWorkOrders />
              </AppLayout>
            ),
          },
          {
            path: 'work-orders/create',
            element: (
              <AppLayout>
                <CreateWorkOrder />
              </AppLayout>
            ),
          },
          {
            path: 'work-orders/edit/:id',
            element: (
              <AppLayout>
                <EditWorkOrder />
              </AppLayout>
            ),
          },
          {
            path: 'work-reports/:id',
            element: (
              <AppLayout>
                <WorkReport />
              </AppLayout>
            ),
          },
          {
            path: 'inventory',
            element: (
              <AppLayout>
                <AdminInventory />
              </AppLayout>
            ),
          },
          {
            path: 'workers',
            element: (
              <AppLayout>
                <AdminWorkers />
              </AppLayout>
            ),
          },
          {
            path: 'resources',
            element: (
              <AppLayout>
                <AdminResources />
              </AppLayout>
            ),
          },
          {
            path: 'resources/create',
            element: (
              <AppLayout>
                <CreateResource />
              </AppLayout>
            ),
          },
          {
            path: 'resources/edit/:id',
            element: (
              <AppLayout>
                <EditResource />
              </AppLayout>
            ),
          },
          {
            path: 'statistics',
            element: (
              <AppLayout>
                <AdminStats />
              </AppLayout>
            ),
          },
          {
            path: 'settings',
            children: [
              {
                index: true,
                element: <Navigate to="/admin/settings/users" replace />,
              },
              {
                path: 'users',
                element: (
                  <AppLayout>
                    <AdminUsers />
                  </AppLayout>
                ),
              },
              {
                path: 'users/create',
                element: (
                  <AppLayout>
                    <CreateUser />
                  </AppLayout>
                ),
              },
              {
                path: 'users/edit/:id',
                element: (
                  <AppLayout>
                    <EditUser />
                  </AppLayout>
                ),
              },
              {
                path: 'contracts',
                element: (
                  <AppLayout>
                    <AdminContracts />
                  </AppLayout>
                ),
              },
              {
                path: 'contracts/create',
                element: (
                  <AppLayout>
                    <CreateContract />
                  </AppLayout>
                ),
              },
              {
                path: 'contracts/edit/:id',
                element: (
                  <AppLayout>
                    <EditContract />
                  </AppLayout>
                ),
              },
              {
                path: 'element-types',
                element: (
                  <AppLayout>
                    <AdminElementTypes />
                  </AppLayout>
                ),
              },
              {
                path: 'element-types/create',
                element: (
                  <AppLayout>
                    <CreateElementTypes />
                  </AppLayout>
                ),
              },
              {
                path: 'element-types/edit/:id',
                element: (
                  <AppLayout>
                    <EditElementTypes />
                  </AppLayout>
                ),
              },
              {
                path: 'tree-types',
                element: (
                  <AppLayout>
                    <AdminTreeTypes />
                  </AppLayout>
                ),
              },
              {
                path: 'tree-types/create',
                element: (
                  <AppLayout>
                    <CreateTreeType />
                  </AppLayout>
                ),
              },
              {
                path: 'tree-types/edit/:id',
                element: (
                  <AppLayout>
                    <EditTreeType />
                  </AppLayout>
                ),
              },
              {
                path: 'task-types',
                element: (
                  <AppLayout>
                    <AdminTaskTypes />
                  </AppLayout>
                ),
              },
              {
                path: 'task-types/create',
                element: (
                  <AppLayout>
                    <CreateTaskType />
                  </AppLayout>
                ),
              },
              {
                path: 'task-types/edit/:id',
                element: (
                  <AppLayout>
                    <EditTaskType />
                  </AppLayout>
                ),
              },
              {
                path: 'resource-types',
                element: (
                  <AppLayout>
                    <AdminResourceTypes />
                  </AppLayout>
                ),
              },
              {
                path: 'resource-types/create',
                element: (
                  <AppLayout>
                    <CreateResourceType />
                  </AppLayout>
                ),
              },
              {
                path: 'resource-types/edit/:id',
                element: (
                  <AppLayout>
                    <EditResourceType />
                  </AppLayout>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
] as RouteObject[];
