import { productCtrl } from "@/infrastructure/container/product.container";
import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import {
  createProductZod,
  updateProductZod,
  updateStockZod,
} from "../validations/product.zod";
import { IdParamZod } from "@/_R/validation/rules/shard.schema";
import { uploadSingleImage } from "@/presentation/middlewares/multer.middleware";
import { uploadToCloudinary } from "@/presentation/middlewares/image.middleware";

const router = Router();

router
  .route("/")
  .get(productCtrl.getAll)
  .post(validate(createProductZod), productCtrl.create);

router.get("/trash", productCtrl.getDeleted);
router.get("/latest", productCtrl.getLatest);
router.get("/top-rated", productCtrl.getTopRated);
router.get("/top-ten", productCtrl.getTopTen);
router.get("/out-of-stock", productCtrl.getOutOfStock);
router.get("/low-stock", productCtrl.getLowStock);
router.get("/high-stock", productCtrl.getHighStock);

router.get(
  "/by-category/:id",
  validate(IdParamZod, "params"),
  productCtrl.getByCategory,
);
router.get(
  "/by-brand/:id",
  validate(IdParamZod, "params"),
  productCtrl.getByBrand,
);
router.get(
  "/by-subcategory/:id",
  validate(IdParamZod, "params"),
  productCtrl.getBySubcategory,
);

router.get(
  "/related/:id",
  validate(IdParamZod, "params"),
  productCtrl.getRelated,
);

router
  .route("/:id")
  .get(validate(IdParamZod, "params"), productCtrl.getOne)
  .patch(
    validate(IdParamZod, "params"),
    uploadSingleImage("image"),
    validate(updateProductZod),
    uploadToCloudinary("products"),
    productCtrl.update,
  )
  .delete(validate(IdParamZod, "params"), productCtrl.soft);

router.patch(
  "/stock/:id",
  validate(IdParamZod, "params"),
  validate(updateStockZod),
  productCtrl.updateStock,
);

router.patch(
  "/restore/:id",
  validate(IdParamZod, "params"),
  productCtrl.restore,
);

export default {
  path: "/products",
  router,
};
