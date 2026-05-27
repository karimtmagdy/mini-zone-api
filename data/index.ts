import { Router } from "express";
import employeeAdminRoutes from "./admin/employee.admin.routes.js";
import userAdminRoutes from "./admin/user.admin.routes.js";
import userRoutes from "./public/profile.routes.js";
import authRoutes from "./public/auth.routes.js";

const rootRouter = Router();

// Public Routes (no auth)
rootRouter.use("/auth", authRoutes);

// User Routes (require login)
rootRouter.use("/users", userRoutes);

// Admin Routes (require login + role check)
rootRouter.use("/admin/employees", employeeAdminRoutes);
rootRouter.use("/admin/users", userAdminRoutes);

export default rootRouter;
