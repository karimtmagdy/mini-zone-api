import { Router } from "express";
import { brandCtrl } from "@/controllers/brand.controller";
import { createBrandZod, updateBrandZod } from "@/validation/brand.schema";
import { validate } from "@/middlewares/validate";
import { IdParamZod } from "@/validation/rules/shard.schema";
const router = Router();

router
  .route("/")
  .get(brandCtrl.getAll)
  .post(validate(createBrandZod), brandCtrl.create);

router.get("/trash", brandCtrl.getDeleted);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), brandCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    validate(updateBrandZod),
    brandCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), brandCtrl.softDelete);
// Default delete is now soft delete

router.patch("/:id/restore", validate(IdParamZod, "params"), brandCtrl.restore);

// router.patch("/:id/restore", validate(IdParamZod, "params"), brandCtrl.restore);
// .delete(validate(MultipleBulkZod), brandCtrl.deleteBulk);
//   checkPermission(["admin"]),
//   upload.single("image"),

export default {
  path: "/brands",
  router,
};
