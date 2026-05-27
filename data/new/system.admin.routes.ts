import { Router } from "express";
import { systemController } from "../../controllers/system.controller";
import { validate } from "../../middlewares/validate";
import { updateSystemZod } from "../../schema/system.schema";
import { authenticated, checkPermission } from "../../middlewares/authroized";

const router = Router();
router.use(authenticated);
router
  .route("/")
  .get(systemController.getSettings)
  .patch(
    checkPermission(["admin"]),
    validate(updateSystemZod),
    systemController.updateSettings,
  );

router.get("/status", systemController.getStatus);

export default {
  path: "/system",
  router,
};
