import { Router } from "express";
import { ctrlEmployee } from "@/presentation/controller/employee.controller";
import { authenticated } from "@/common/middleware/authorize-middleware";
import { requirePermission } from "@/common/middleware/permission-middleware";

const router = Router();

router.use(authenticated);

// Bootstrap first admin before permission gates exist.
router.post("/bootstrap", ctrlEmployee.bootstrap);

// Create login + employee profile together (preferred for admin UI).
router.post(
  "/hire",
  requirePermission("employee:create"),
  ctrlEmployee.hire,
);

router
  .route("/")
  .get(requirePermission("employee:read"), ctrlEmployee.all)
  .post(requirePermission("employee:create"), ctrlEmployee.create);

router.patch(
  "/restore/:employeeId",
  requirePermission("employee:update"),
  ctrlEmployee.restore,
);
router.patch(
  "/archive/:employeeId",
  requirePermission("employee:update"),
  ctrlEmployee.archive,
);
router.patch(
  "/status/:employeeId",
  requirePermission("employee:update"),
  ctrlEmployee.updateStatus,
);

router
  .route("/:employeeId")
  .get(requirePermission("employee:read"), ctrlEmployee.one)
  .patch(requirePermission("employee:update"), ctrlEmployee.update)
  .delete(requirePermission("employee:delete"), ctrlEmployee.remove);

export default {
  path: "/employees",
  router,
};
