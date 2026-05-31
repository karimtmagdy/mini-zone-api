import { Router } from "express";
import { userCtrl } from "@/infrastructure/container/user.container";
import {
  authenticated,
  checkPermission,
} from "@/presentation/middlewares/authorized";
import { validate } from "@/presentation/middlewares/validate";
import {
  createUserZod,
  updateUserZod,
  userQueryZod,
  changeRoleZod,
  updateStatusZod,
  bulkIdsZod,
} from "@/shared/schema/person.zod";
import { IdParamZod } from "@/shared/schema/shard.schema";

const router = Router();

// router.use(authenticated);

router.get("/archived", userCtrl.getDeleted);
router.patch("/restore/:id", userCtrl.restore);

router
  .route("/")
  .get(validate(userQueryZod, "query"), userCtrl.getAll)
  .post(validate(createUserZod), userCtrl.create);

router
  .route("/:id")
  .get(userCtrl.getOne)
  .patch(validate(updateUserZod), userCtrl.update)
  .delete(userCtrl.soft);

router.patch(
  "/deactivate/:id",
  checkPermission(["admin"]),
  validate(IdParamZod, "params"),
  userCtrl.deactivate,
);

router.patch(
  "/unlock/:id",
  checkPermission(["admin"]),
  validate(IdParamZod, "params"),
  userCtrl.unlock,
);

router.patch(
  "/role/:id",
  checkPermission(["admin"]),
  validate(changeRoleZod),
  userCtrl.changeRole,
);

router.patch(
  "/reactivate/:id",
  checkPermission(["admin"]),
  validate(IdParamZod, "params"),
  userCtrl.reactivate,
);

router.patch(
  "/status/:id",
  checkPermission(["admin"]),
  validate(updateStatusZod),
  userCtrl.updateStatus,
);

router.patch(
  "/ban/:id",
  checkPermission(["admin"]),
  validate(IdParamZod, "params"),
  userCtrl.ban,
);

router.post(
  "/bulk-deactivate",
  checkPermission(["admin"]),
  validate(bulkIdsZod),
  userCtrl.bulkDeactivate,
);

router.post(
  "/bulk-archive",
  checkPermission(["admin"]),
  validate(bulkIdsZod),
  userCtrl.bulkArchive,
);

router.post(
  "/bulk-delete",
  checkPermission(["admin"]),
  validate(bulkIdsZod),
  userCtrl.bulkDelete,
);

export default {
  path: "/users",
  router,
};
// router.patch("/permission/:id");
