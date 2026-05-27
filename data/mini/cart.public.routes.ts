import { Router } from "express";
import { cartController } from "@/controllers/cart.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import {
  addToCartSchema,
  updateCartItemSchema,
  applyCouponSchema,
} from "@/schema/cart.schema";

const router = Router();

router.use(authenticate);

router
  .route("/")
  .get(cartController.getLoggedUserCart.bind(cartController))
  .post(
    validate(addToCartSchema),
    cartController.addProductToCart.bind(cartController),
  )
  .delete(cartController.clearCart.bind(cartController));

router.put(
  "/apply-coupon",
  validate(applyCouponSchema),
  cartController.applyCoupon.bind(cartController),
);

router
  .route("/:itemId")
  .put(
    validate(updateCartItemSchema),
    cartController.updateCartItemQuantity.bind(cartController),
  )
  .delete(cartController.removeCartItem.bind(cartController));

export { router as cartPublicRouter };
