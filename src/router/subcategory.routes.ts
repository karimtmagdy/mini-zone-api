import { Router } from "express";
import { subcategoryCtrl } from "@/controllers/subcategory.controller";
import { validate } from "@/middlewares/validate";
import {
  createSubCategoryZod,
  updateSubCategoryZod,
} from "@/validation/subcategory.schema";
import { IdParamZod, MultipleBulkZod } from "@/validation/rules/shard.schema";

const router = Router();

router
  .route("/")
  .get(subcategoryCtrl.getAll)
  .post(validate(createSubCategoryZod), subcategoryCtrl.create);
// Bulk delete removed as backend base classes do not support it yet
// .delete(validate(MultipleBulkZod), subcategoryCtrl.deleteBulk);

router.get("/trash", subcategoryCtrl.getDeleted);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), subcategoryCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    validate(updateSubCategoryZod),
    subcategoryCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), subcategoryCtrl.delete);

router
  .route("/trash/:id")
  .patch(validate(IdParamZod, "params"), subcategoryCtrl.softDelete);

router.patch(
  "/restore/:id",
  validate(IdParamZod, "params"),
  subcategoryCtrl.restore,
);

export default {
  path: "/subcategories",
  router,
};
