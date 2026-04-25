import { Router } from "express";
import { validate } from "@/middlewares/validate";
import { profileCtrl } from "@/controllers/profile.controller";
import { authenticated } from "@/middlewares/authroized";
import {
  deactivateUserZod,
  deleteUserZod,
} from "@/validation/user.schema";
import { updateProfileZod } from "@/validation/profile.schema";
import { IdParamZod } from "@/validation/rules/shard.schema";

const router = Router();
router.use(authenticated);

router
  .route("/")
  .get(profileCtrl.getProfile)
  .patch(validate(updateProfileZod, "body"), profileCtrl.updateProfile);

router.patch(
  "/deactivate",
  validate(deactivateUserZod, "body"),
  profileCtrl.deactivateProfile,
);

router.delete(
  "/delete",
  validate(deleteUserZod, "body"),
  profileCtrl.deleteProfile,
);
router.delete(
  "/delete/image",
  validate(IdParamZod, "params"),
  profileCtrl.deleteImage,
);

export default {
  path: "/profile",
  router,
};
