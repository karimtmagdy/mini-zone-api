import { Router } from "express";
import { ctrlBrand } from "@/presentation/controller/brand.controller";

const router = Router();

router.route("/").get(ctrlBrand.all).post(ctrlBrand.create);

router
  .route("/:brandId")
  .get(ctrlBrand.one)
  .patch(ctrlBrand.update)
  .delete(ctrlBrand.remove);

router.patch("/restore/:brandId", ctrlBrand.restore);
router.patch("/archive/:brandId", ctrlBrand.archive);
router.patch("/status/:brandId", ctrlBrand.updateStatus);

export default {
  path: "/brands",
  router,
};
