import AdminLayoutWrapper from '@/components/Admin/Dashboard/AdminDashboardWrapper';
import AdminProtectedRoute from '@/middlewares/AdminProtectedRoute';

import AdminDashboard from '@/pages/Admin/Dashboard';
import AdminUsers from '@/pages/Admin/Settings/Users';
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
                                path: 'task-types',
                                element: (
                                    <AdminLayoutWrapper titleI18n="admin.pages.taskTypes.title">
                                        <AdminTaskTypes />
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
                        ],
                    },
                ],
            },
        ],
    },
];

export default AdminRoutes;
