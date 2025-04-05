import AuthenticatedRoute from '@/middlewares/AuthenticatedRoute';

import Account from '@/pages/Admin/Account/Account';
import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminInventory from '@/pages/Admin/Inventory';
import AdminContracts from '@/pages/Admin/Settings/Contracts/Contracts';
import CreateContract from '@/pages/Admin/Settings/Contracts/Create';
import EditContract from '@/pages/Admin/Settings/Contracts/Edit';
import DuplicateContractForm from '@/pages/Admin/Settings/Contracts/DuplicateContractForm';
import CreateElementTypes from '@/pages/Admin/Settings/Element Types/Create';
import EditElementTypes from '@/pages/Admin/Settings/Element Types/Edit';
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
import Eva from '@/pages/Admin/Eva/Eva';
import EditEva from '@/pages/Admin/Eva/Edit';
import ShowEva from '@/pages/Admin/Eva/Show';
import CreateEva from '@/pages/Admin/Eva/Create';
import Sensors from '@/pages/Admin/Sensor/Sensors';
import CreateSensor from '@/pages/Admin/Sensor/Create';
import EditSensor from '@/pages/Admin/Sensor/Edit';

import { Navigate, RouteObject } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Roles } from '@/types/Role';

const AdminRoutes: RouteObject[] = [
  {
    element: (
      <AuthenticatedRoute allowedRoles={[Roles.admin]} redirectPath="/worker" />
    ),
    children: [
      {
        path: '/admin',
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          {
            path: 'dashboard',
            element: (
              <AdminLayout titleI18n="admin.pages.dashboard.title">
                <AdminDashboard />
              </AdminLayout>
            ),
          },
          {
            path: 'evas',
            element: (
              <AdminLayout titleI18n="admin.pages.evas.title">
                <Eva />
              </AdminLayout>
            ),
          },
          {
            path: 'evas/create',
            element: (
              <AdminLayout titleI18n="admin.pages.evas.create.title">
                <CreateEva />
              </AdminLayout>
            ),
          },
          {
            path: 'evas/edit/:id',
            element: (
              <AdminLayout titleI18n="admin.pages.evas.edit.title">
                <EditEva />
              </AdminLayout>
            ),
          },
          {
            path: 'evas/:id',
            element: (
              <AdminLayout titleI18n="admin.pages.evas.show.title">
                <ShowEva />
              </AdminLayout>
            ),
          },
          {
            path: 'work-orders',
            element: (
              <AdminLayout titleI18n="admin.pages.workOrders.title">
                <AdminWorkOrders />
              </AdminLayout>
            ),
          },
          {
            path: 'work-orders/create',
            element: (
              <AdminLayout titleI18n="admin.pages.workOrders.create.title">
                <CreateWorkOrder />
              </AdminLayout>
            ),
          },
          {
            path: 'work-orders/edit/:id',
            element: (
              <AdminLayout titleI18n="admin.pages.workOrders.edit.title">
                <EditWorkOrder />
              </AdminLayout>
            ),
          },
          {
            path: 'work-reports/:id',
            element: (
              <AdminLayout titleI18n="admin.pages.workReports.show.title">
                <WorkReport />
              </AdminLayout>
            ),
          },
          {
            path: 'inventory',
            element: (
              <AdminLayout titleI18n="admin.pages.inventory.title">
                <AdminInventory />
              </AdminLayout>
            ),
          },
          {
            path: 'workers',
            element: (
              <AdminLayout titleI18n="admin.pages.workers.title">
                <AdminWorkers />
              </AdminLayout>
            ),
          },
          {
            path: 'resources',
            element: (
              <AdminLayout titleI18n="admin.pages.resources.title">
                <AdminResources />
              </AdminLayout>
            ),
          },
          {
            path: 'resources/create',
            element: (
              <AdminLayout titleI18n="admin.pages.resources.create.title">
                <CreateResource />
              </AdminLayout>
            ),
          },
          {
            path: 'resources/edit/:id',
            element: (
              <AdminLayout titleI18n="admin.pages.resources.edit.title">
                <EditResource />
              </AdminLayout>
            ),
          },
          {
            path: 'statistics',
            element: (
              <AdminLayout titleI18n="admin.pages.stats.title">
                <AdminStats />
              </AdminLayout>
            ),
          },
          {
            path: 'sensors',
            element: (
              <AdminLayout titleI18n="admin.pages.sensors.title">
                <Sensors />
              </AdminLayout>
            ),
          },
          {
            path: 'sensors/create',
            element: (
              <AdminLayout titleI18n="admin.pages.sensors.create.title">
                <CreateSensor />
              </AdminLayout>
            ),
          },
          {
            path: 'sensors/edit/:id',
            element: (
              <AdminLayout titleI18n="admin.pages.sensors.edit.title">
                <EditSensor />
              </AdminLayout>
            ),
          },
          {
            path: 'account',
            element: (
              <AdminLayout titleI18n="admin.pages.account.title">
                <Account />
              </AdminLayout>
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
                  <AdminLayout titleI18n="admin.pages.users.title">
                    <AdminUsers />
                  </AdminLayout>
                ),
              },
              {
                path: 'users/create',
                element: (
                  <AdminLayout titleI18n="admin.pages.users.create.title">
                    <CreateUser />
                  </AdminLayout>
                ),
              },
              {
                path: 'users/edit/:id',
                element: (
                  <AdminLayout titleI18n="admin.pages.users.edit.title">
                    <EditUser />
                  </AdminLayout>
                ),
              },
              {
                path: 'contracts',
                element: (
                  <AdminLayout titleI18n="admin.pages.contracts.title">
                    <AdminContracts />
                  </AdminLayout>
                ),
              },
              {
                path: 'contracts/create',
                element: (
                  <AdminLayout titleI18n="admin.pages.contracts.create.title">
                    <CreateContract />
                  </AdminLayout>
                ),
              },
              {
                path: 'contracts/edit/:id',
                element: (
                  <AdminLayout titleI18n="admin.pages.contracts.edit.title">
                    <EditContract />
                  </AdminLayout>
                ),
              },
              {
                path: 'contracts/:id/duplicate',
                element: (
                  <AdminLayout titleI18n="admin.pages.contracts.duplicate.title">
                    <DuplicateContractForm />
                  </AdminLayout>
                ),
              },
              {
                path: 'element-types',
                element: (
                  <AdminLayout titleI18n="admin.pages.elementTypes.title">
                    <AdminElementTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'element-types/create',
                element: (
                  <AdminLayout titleI18n="admin.pages.elementTypes.create.title">
                    <CreateElementTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'element-types/edit/:id',
                element: (
                  <AdminLayout titleI18n="admin.pages.elementTypes.edit.title">
                    <EditElementTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'tree-types',
                element: (
                  <AdminLayout titleI18n="admin.pages.treeTypes.title">
                    <AdminTreeTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'tree-types/create',
                element: (
                  <AdminLayout titleI18n="admin.pages.treeTypes.create.title">
                    <CreateTreeType />
                  </AdminLayout>
                ),
              },
              {
                path: 'tree-types/edit/:id',
                element: (
                  <AdminLayout titleI18n="admin.pages.treeTypes.edit.title">
                    <EditTreeType />
                  </AdminLayout>
                ),
              },
              {
                path: 'task-types',
                element: (
                  <AdminLayout titleI18n="admin.pages.taskTypes.title">
                    <AdminTaskTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'task-types/create',
                element: (
                  <AdminLayout titleI18n="admin.pages.taskTypes.create.title">
                    <CreateTaskType />
                  </AdminLayout>
                ),
              },
              {
                path: 'task-types/edit/:id',
                element: (
                  <AdminLayout titleI18n="admin.pages.taskTypes.edit.title">
                    <EditTaskType />
                  </AdminLayout>
                ),
              },
              {
                path: 'resource-types',
                element: (
                  <AdminLayout titleI18n="admin.pages.resourceTypes.title">
                    <AdminResourceTypes />
                  </AdminLayout>
                ),
              },
              {
                path: 'resource-types/create',
                element: (
                  <AdminLayout titleI18n="admin.pages.resourceTypes.create.title">
                    <CreateResourceType />
                  </AdminLayout>
                ),
              },
              {
                path: 'resource-types/edit/:id',
                element: (
                  <AdminLayout titleI18n="admin.pages.resourceTypes.edit.title">
                    <EditResourceType />
                  </AdminLayout>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];

export default AdminRoutes;
