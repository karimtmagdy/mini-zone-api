import { Router } from "express";
import { brandCtrl } from "@/infrastructure/container/brand.container";
import { createBrandZod, updateBrandZod } from "../validations/brand.validator";
import { validate } from "@/presentation/middlewares/validate";
import { uploadSingleImage } from "@/presentation/middlewares/multer.middleware";
import { uploadToCloudinary } from "@/presentation/middlewares/image.middleware";
import { IdParamZod } from "@/_R/validation/rules/shard.schema";

const router = Router();

router
  .route("/")
  .get(brandCtrl.getAll)
  .post(
    uploadSingleImage("image"),
    validate(createBrandZod),
    uploadToCloudinary("brands"),
    brandCtrl.create,
  );

router.get("/trash", brandCtrl.getDeleted);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), brandCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    uploadSingleImage("image"),
    validate(updateBrandZod),
    uploadToCloudinary("brands"),
    brandCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), brandCtrl.soft);

router.patch("/restore/:id", validate(IdParamZod, "params"), brandCtrl.restore);

export default {
  path: "/brands",
  router,
};
