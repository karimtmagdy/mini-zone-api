import { subCategoryCtrl } from "@/infrastructure/container/subcategory.container";
import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import {
  createSubCategoryZod,
  updateSubCategoryZod,
} from "../validation/subcategory.zod";
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
  .get(subCategoryCtrl.getAll)
  .post(
    authenticated,
    checkPermission(["admin", "super-admin"]),
    validate(createSubCategoryZod),
    subCategoryCtrl.create,
  );

router.get("/trash", subCategoryCtrl.getDeleted);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), subCategoryCtrl.getOne)
  .patch(
    // authenticated,
    // checkPermission(["admin", "super-admin"]),
    validate(IdParamZod, "params"),
    uploadSingleImage("image"),
    validate(updateSubCategoryZod),
    uploadToCloudinary("subcategories"),
    subCategoryCtrl.update,
  )
  .delete(
    authenticated,
    checkPermission(["admin", "super-admin"]),
    validate(IdParamZod, "params"),
    subCategoryCtrl.soft,
  );

router.patch(
  "/restore/:id",
  authenticated,
  checkPermission(["admin", "super-admin"]),
  validate(IdParamZod, "params"),
  subCategoryCtrl.restore,
);

export default {
  path: "/subcategories",
  router,
};
// Bulk delete removed as backend base classes do not support it yet
// .delete(validate(MultipleBulkZod), subcategoryCtrl.deleteBulk);
