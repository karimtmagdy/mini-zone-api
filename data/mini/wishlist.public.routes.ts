import { Router } from "express";
import { wishlistController } from "@/controllers/wishlist.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import {
  addToWishlistSchema,
  removeFromWishlistSchema,
} from "@/schema/wishlist.schema";

const router = Router();

router.use(authenticate);

router
  .route("/")
  .get(wishlistController.getWishlist)
  .post(validate(addToWishlistSchema), wishlistController.addProductToWishlist);

router.delete(
  "/:productId",
  validate(removeFromWishlistSchema),
  wishlistController.removeProductFromWishlist,
);

export { router as wishlistPublicRouter };
