import { Router } from "express";
import { validate } from "@/presentation/middlewares/validate";
import { profileCtrl } from "@/_R/profile.controller";
import { authenticated } from "@/presentation/middlewares/authorized";
import { deactivateUserZod, deleteUserZod } from "@/presentation/user.schema";
import { updateProfileZod } from "@/presentation/validation/profile.schema";
import { IdParamZod } from "@/shared/schema/shard.schema";

const router = Router();
router.use(authenticated);

router
  .route("/")
  .get(profileCtrl.getProfile)
  .patch(validate(updateProfileZod, "body"), profileCtrl.updateProfile);

router.patch(
  "/deactivate",
  validate(deactivateUserZod, "body"),
  profileCtrl.deactivateProfile,
);

router.delete(
  "/delete",
  validate(deleteUserZod, "body"),
  profileCtrl.deleteProfile,
);
router.delete(
  "/delete/image",
  validate(IdParamZod, "params"),
  profileCtrl.deleteImage,
);

export default {
  path: "/profile",
  router,
};

// router.get("/me", userController.getProfile);
// router.get("/me/cart", cartController.getCart);
// router.post("/me/cart", cartController.addToCart);
// router.post("/me/cart/apply-coupon", cartController.applyCoupon);
// router.delete("/me/cart/:productId", cartController.removeFromCart);
// router.post("/me/wishlist/:productId", wishlistController.addToWishlist);
// router.delete("/me/wishlist/:productId", wishlistController.removeFromWishlist);
// router.get("/me/orders", orderController.getUserOrders);
// router.get("/me/addresses", addressController.getAddresses);
// router.post("/me/addresses", addressController.addAddress);
// router.put("/me/addresses/:addressId", addressController.updateAddress);
// router.delete("/me/addresses/:addressId", addressController.deleteAddress);

// // Profile management
// router.post(
//   "/me/update-profile",
//   upload.single("image"),
//   userController.updateProfile
// );
// router.post("/me/change-password", authController.changePassword);
// router.post("/me/verify-email", authController.verifyEmail);
