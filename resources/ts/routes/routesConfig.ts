import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";
import WorkerRoutes from "./WorkerRoutes";

const routesConfig = [
  ...AuthRoutes,
  ...AdminRoutes,
  ...WorkerRoutes,
];

export default routesConfig;
