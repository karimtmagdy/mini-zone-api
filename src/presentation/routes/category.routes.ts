import { categoryCtrl } from "@/infrastructure/container/category.container";
import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import {
  createCategoryZod,
  updateCategoryZod,
} from "../validations/category.zod";
import { IdParamZod } from "@/_R/validation/rules/shard.schema";
import { uploadSingleImage } from "@/presentation/middlewares/multer.middleware";
import { uploadToCloudinary } from "@/presentation/middlewares/image.middleware";

const router = Router();

router
  .route("/")
  .get(categoryCtrl.getAll)
  .post(validate(createCategoryZod), categoryCtrl.create);

router.get("/trash", categoryCtrl.getDeleted);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), categoryCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    uploadSingleImage("image"),
    validate(updateCategoryZod),
    uploadToCloudinary("categories"),
    categoryCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), categoryCtrl.soft);

router.patch(
  "/restore/:id",
  validate(IdParamZod, "params"),
  categoryCtrl.restore,
);

export default {
  path: "/categories",
  router,
};
