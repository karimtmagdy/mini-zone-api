import { Router } from "express";
import { categoryCtrl } from "@/controllers/category.controller";
import {
  createCategoryZod,
  updateCategoryZod,
} from "@/validation/category.schema";
import { validate } from "@/middlewares/validate";
import { IdParamZod } from "@/validation/rules/shard.schema";
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
    validate(updateCategoryZod),
    categoryCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), categoryCtrl.softDelete);

router.patch(
  "/:id/restore",
  validate(IdParamZod, "params"),
  categoryCtrl.restore,
);

export default {
  path: "/categories",
  router,
};
