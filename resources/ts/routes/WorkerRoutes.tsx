import { RouteObject } from 'react-router-dom';

import AuthenticatedRoute from '@/middlewares/AuthenticatedRoute';
import { Roles } from '@/types/Role';

const WorkerRoutes: RouteObject[] = [
  {
    element: <AuthenticatedRoute allowedRoles={[Roles.worker]} />,
    children: [
      {
        path: 'worker',
        element: <>Hello Worker</>,
      },
    ],
  },
];

export default WorkerRoutes;
