import { Router } from "express";
import { reviewController } from "@/controllers/review.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { createReviewSchema, updateReviewSchema } from "@/schema/review.schema";

const router = Router();

router.use(authenticate);

// Note: Users can create/update their own reviews, Admin/Manager can manage all.
// Usually, we'd have another file for "user" routes, but following "admin" vs "public":
// Management of reviews falls under admin/authenticated space.

router.post(
  "/products/:productId/reviews",
  authorize(["user", "admin", "manager", "moderator"]),
  validate(createReviewSchema),
  reviewController.createReview.bind(reviewController) as any
);

router
  .route("/reviews/:id")
  .put(
    authorize(["user", "admin", "manager", "moderator"]),
    validate(updateReviewSchema),
    reviewController.updateReview.bind(reviewController) as any
  )
  .delete(
    authorize(["admin", "manager", "user", "moderator"]),
    reviewController.deleteReview.bind(reviewController) as any
  );

export { router as reviewAdminRouter };
