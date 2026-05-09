import { subCategoryCtrl } from "@/infrastructure/container/subcategory.container";
import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import {
  createSubCategoryZod,
  updateSubCategoryZod,
} from "../validations/subcategory.zod";
import { IdParamZod } from "@/_R/validation/rules/shard.schema";
import { uploadSingleImage } from "@/presentation/middlewares/multer.middleware";
import { uploadToCloudinary } from "@/presentation/middlewares/image.middleware";

const router = Router();

router
  .route("/")
  .get(subCategoryCtrl.getAll)
  .post(validate(createSubCategoryZod), subCategoryCtrl.create);

router.get("/trash", subCategoryCtrl.getDeleted);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), subCategoryCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    uploadSingleImage("image"),
    validate(updateSubCategoryZod),
    uploadToCloudinary("subcategories"),
    subCategoryCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), subCategoryCtrl.soft);

router.patch(
  "/restore/:id",
  validate(IdParamZod, "params"),
  subCategoryCtrl.restore,
);

export default {
  path: "/subcategories",
  router,
};
