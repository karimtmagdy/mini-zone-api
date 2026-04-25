import { Router } from "express";
import { productCtrl } from "@/controllers/product.controller";
import { validate } from "@/middlewares/validate";
import {
  createProductZod,
  updateProductZod,
} from "@/validation/product.schema";

const router = Router();

router
  .route("/")
  .get(productCtrl.getAll)
  .post(validate(createProductZod), productCtrl.create);
router
  .route("/:id")
  .get(productCtrl.getOne)
  .patch(validate(updateProductZod), productCtrl.update)
  .delete(productCtrl.delete);

router.get("/trash", productCtrl.getDeleted);
router.patch("/restore/:id", productCtrl.restore);
router.delete("/trash/:id", productCtrl.softDelete);

export default {
  path: "/products",
  router,
};
