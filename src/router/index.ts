import { Router } from "express";
import employeeAdminRoutes from "./admin/employee.admin.routes.js";
import userAdminRoutes from "./admin/user.admin.routes.js";

const rootRouter = Router();

// Admin Routes
rootRouter.use("/admin/employees", employeeAdminRoutes);
rootRouter.use("/admin/users", userAdminRoutes);

export default rootRouter;
