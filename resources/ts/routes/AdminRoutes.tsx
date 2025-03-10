import AdminLayout from '@/layouts/AdminLayout';
import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';

import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminUsers from '@/pages/Admin/Settings/Users/Users';
import CreateUser from "@/pages/Admin/Settings/Users/Create";
import EditUser from '@/pages/Admin/Settings/Users/Edit';
import AdminContracts from '@/pages/Admin/Settings/Contracts/Contracts';
import CreateContract from '@/pages/Admin/Settings/Contracts/Create';
import EditContract from '@/pages/Admin/Settings/Contracts/Edit';
import AdminWorkOrders from '@/pages/Admin/WorkOrders';
import AdminElementTypes from '@/pages/Admin/Settings/Element Types/ElementTypes';
import AdminTreeTypes from '@/pages/Admin/Settings/Tree Types/TreeTypes';
import CreateTreeType from '@/pages/Admin/Settings/Tree Types/Create';
import EditTreeType from '@/pages/Admin/Settings/Tree Types/Edit';

import AdminTaskTypes from '@/pages/Admin/Settings/Task Types/TaskTypes';
import CreateTaskType from "@/pages/Admin/Settings/Task Types/Create";
import EditTaskType from "@/pages/Admin/Settings/Task Types/Edit";
import AdminInventory from '@/pages/Admin/Inventory';
import AdminWorkers from '@/pages/Admin/Workers';
import AdminResources from '@/pages/Admin/Resources';
import AdminResourceTypes from '@/pages/Admin/Settings/Resource Types/ResourceTypes';
import EditResourceType from '@/pages/Admin/Settings/Resource Types/Edit';
import CreateResourceType from '@/pages/Admin/Settings/Resource Types/Create';
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
                path: 'users/edit/:id',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.users.edit.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <EditUser />
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
                path: 'contracts/create',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.contracts.create.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <CreateContract />
                  </AdminLayout>
                ),
              },
              {
                path: 'contracts/edit/:id',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.contracts.edit.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <EditContract />
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
                path: 'tree-types/create',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.treeTypes.create.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <CreateTreeType />
                  </AdminLayout>
                ),
              },
              {
                path: 'tree-types/edit/:id',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.treeTypes.edit.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <EditTreeType />
                  </AdminLayout>
                ),
              },
              {
                path: 'tree-types/create',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.treeTypes.create.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <CreateTreeType />
                  </AdminLayout>
                ),
              },
              {
                path: 'tree-types/edit/:id',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.treeTypes.edit.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <EditTreeType />
                  </AdminLayout>
                ),
              },
              {
                path: "task-types",
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.taskTypes.title"
                    contracts={[{ id: "1", name: "Tortosa" }]}
                    currentContract="1">
                    <AdminTaskTypes />
                  </AdminLayout>
                ),
              },
              {
                path: "task-types/create",
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.taskTypes.create.title"
                    contracts={[{ id: "1", name: "Tortosa" }]}
                    currentContract="1">
                    <CreateTaskType />
                  </AdminLayout>
                ),
              },
              {
                path: "task-types/edit/:id",
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.taskTypes.edit.title"
                    contracts={[{ id: "1", name: "Tortosa" }]}
                    currentContract="1">
                    <EditTaskType />
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
              {
                path: 'resource-types/create',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.resourceTypes.create.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
                    <CreateResourceType />
                  </AdminLayout>
                ),
              },
              {
                path: 'resource-types/edit/:id',
                element: (
                  <AdminLayout
                    titleI18n="admin.pages.resourceTypes.edit.title"
                    contracts={[{ id: '1', name: 'Tortosa' }]}
                    currentContract={'1'}>
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
                        path: 'stats',
                        element: (
                            <AdminLayoutWrapper titleI18n="admin.pages.stats.title">
                                <AdminStats />
                            </AdminLayoutWrapper>
                        ),
                    },
                    {
                        path: 'settings',
                        children: [
                            {
                                index: true,
                                element: (
                                    <Navigate to="/admin/settings/users" />
                                ),
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
