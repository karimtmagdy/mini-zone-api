import { Router } from "express";
import { productAdminRouter } from "./product.admin.routes"; 
import { subCategoryAdminRouter } from "./sub.category.admin.routes";
import { couponAdminRouter } from "./coupon.admin.routes";
import { userAdminRouter } from "./user.admin.routes";
import { reviewAdminRouter } from "./review.admin.routes";

const router = Router();

router.use("/products", productAdminRouter); 
router.use("/subcategories", subCategoryAdminRouter);
router.use("/coupons", couponAdminRouter);
router.use("/users", userAdminRouter);
router.use("/", reviewAdminRouter);

export { router as adminRouter };
