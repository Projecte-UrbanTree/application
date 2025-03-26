import AdminRoutes from './AdminRoutes';
import AuthRoutes from './AuthRoutes';
import WorkerRoutes from './WorkerRoutes';

const routesConfig = [...AuthRoutes, ...AdminRoutes, ...WorkerRoutes];

export default routesConfig;
