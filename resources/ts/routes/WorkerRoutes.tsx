import WorkerProtectedRoute from '@/middlewares/WorkerProtectedRoute';
import { Navigate, type RouteObject } from 'react-router-dom';

export default [
  {
    element: <WorkerProtectedRoute />,
    children: [
      {
        path: '/worker',
        children: [
          {
            index: true,
            element: (
              <>
                <></>
              </>
            ),
          },
          {
            path: '*',
            element: <Navigate to="/login" replace />,
          },
        ],
      },
    ],
  },
] as RouteObject[];
