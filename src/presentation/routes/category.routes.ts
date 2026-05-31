import { categoryCtrl } from "@/infrastructure/container/category.container";
import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import {
  createCategoryZod,
  updateCategoryZod,
} from "../validation/category.zod";
import { IdParamZod } from "@/shared/schema/shard.schema";
import { uploadSingleImage } from "@/presentation/middlewares/multer.middleware";
import { uploadToCloudinary } from "@/presentation/middlewares/image.middleware";
import {
  authenticated,
  checkPermission,
} from "@/presentation/middlewares/authorized";

const router = Router();

router
  .route("/")
  .get(categoryCtrl.getAll)
  .post(
    // authenticated,
    // checkPermission(["admin", "super-admin"]),
    validate(createCategoryZod),
    categoryCtrl.create,
  );

router.get("/trash", categoryCtrl.getDeleted);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), categoryCtrl.getOne)
  .patch(
    authenticated,
    checkPermission(["admin", "super-admin"]),
    validate(IdParamZod, "params"),
    uploadSingleImage("image"),
    validate(updateCategoryZod),
    uploadToCloudinary("categories"),
    categoryCtrl.update,
  )
  .delete(
    authenticated,
    checkPermission(["admin", "super-admin"]),
    validate(IdParamZod, "params"),
    categoryCtrl.soft,
  );

router.patch(
  "/restore/:id",
  authenticated,
  checkPermission(["admin", "super-admin"]),
  validate(IdParamZod, "params"),
  categoryCtrl.restore,
);

export default {
  path: "/categories",
  router,
};
