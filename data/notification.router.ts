import { Router } from "express";
import { authenticated, checkPermission } from "../middlewares/authroized.js";
import { validate } from "../middlewares/validate.js";
import { notifyCtrl } from "../controller/notification.controller.js";
import { CreateNotificationSchema } from "../validation/notification.validation.js";

export const notificationRouter = Router();

notificationRouter.use(authenticated);

notificationRouter.get(
  "/",
  checkPermission(["super-admin", "admin", "manager", "hr"]),
  notifyCtrl.getAll,
);

notificationRouter.get("/recipient/:type/:id", notifyCtrl.getForRecipient);

notificationRouter.post(
  "/",
  checkPermission(["super-admin", "admin", "manager"]),
  validate(CreateNotificationSchema), // Type cast to any to circumvent zod version differences
  notifyCtrl.create,
);

notificationRouter.patch("/:id/read", notifyCtrl.markRead);
