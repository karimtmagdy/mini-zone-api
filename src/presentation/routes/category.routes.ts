import { Router } from "express";
import { ctrlCategory } from "@/presentation/controller/category.controller";

const router = Router();
// router.use("/:categoryId/subcategories", subcategoryRouter.router);
router.route("/").get(ctrlCategory.all).post(ctrlCategory.create);

router
  .route("/:categoryId")
  .get(ctrlCategory.one)
  .patch(ctrlCategory.update)
  .delete(ctrlCategory.remove);
// const checker = router.use(authenticated, protectCheck("admin"));
router.patch("/restore/:categoryId", ctrlCategory.restore);
router.patch("/archive/:categoryId", ctrlCategory.archive);
router.patch("/status/:categoryId", ctrlCategory.updateStatus);

export default {
  path: "/categories",
  router,
};
// router.route("/many").patch(
// validate(MultipleZod({ action: "update", resource: "brands" })),
// ctrlCategory.updateManyStatus);
