import { Router } from "express";
 import { authPublicRouter } from "./auth.public.routes";
import { productPublicRouter } from "./product.public.routes";
import { subCategoryPublicRouter } from "./sub.category.public.routes";
import { couponPublicRouter } from "./coupon.public.routes";
import { reviewPublicRouter } from "../mini/review.public.routes";
import { cartPublicRouter } from "../mini/cart.public.routes";
import { wishlistPublicRouter } from "../mini/wishlist.public.routes";
import { uploadPublicRouter } from "../mini/upload.public.routes";
import { paymentPublicRouter } from "../mini/payment.public.routes";
import { webhookRouter } from "../mini/webhook.public.routes";
import { brandPublicRouter } from "./brand.public.routes";

const router = Router();

router.use("/auth", authPublicRouter);
router.use("/brands", brandPublicRouter);
router.use("/auth", authPublicRouter);
router.use("/products", productPublicRouter);
router.use("/subcategories", subCategoryPublicRouter);
router.use("/coupons", couponPublicRouter);
router.use("/", reviewPublicRouter);
router.use("/cart", cartPublicRouter);
router.use("/wishlist", wishlistPublicRouter);
router.use("/uploads", uploadPublicRouter);
router.use("/payment", paymentPublicRouter);
router.use("/webhooks", webhookRouter);
 
export { router as publicRouter };
