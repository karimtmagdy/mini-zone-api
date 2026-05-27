import { Router } from "express";
import { reviewController } from "@/controllers/review.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import {
  getReviewsSchema,
  getSingleReviewSchema,
  getProductReviewSchema,
} from "@/schema/review.schema";

const router = Router();

router.get(
  "/reviews",
  validate(getReviewsSchema),
  reviewController.getAllReviews.bind(reviewController)
);
router.get(
  "/reviews/:id",
  validate(getSingleReviewSchema),
  reviewController.getReviewById.bind(reviewController)
);

router.get(
  "/products/:productId/reviews",
  validate(getProductReviewSchema),
  reviewController.getProductReviews.bind(reviewController)
);
router.get(
  "/products/:productId/reviews/:reviewId",
  validate(getProductReviewSchema),
  reviewController.getSingleProductReview.bind(reviewController)
);

export { router as reviewPublicRouter };
