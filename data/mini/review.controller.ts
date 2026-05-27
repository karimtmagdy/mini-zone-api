import { NextFunction, Request, Response } from "express";
import { reviewService } from "@/services/review.service";
import { AuthRequest } from "@/types/user.dto";

export class ReviewController {
  async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await reviewService.getAllReviews(req.query);
      res.status(200).json({ status: "success", data: reviews });
    } catch (error) {
      next(error);
    }
  }

  async getReviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.getReviewById(req.params.id);
      res.status(200).json({ status: "success", data: review });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.createReview({
        body: req.body,
        productId: req.params.productId,
        userId: req.user._id,
      });
      res.status(201).json({ status: "success", data: review });
    } catch (error) {
      next(error);
    }
  }

  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await reviewService.getProductReviews(
        req.params.productId
      );
      res.status(200).json({ status: "success", data: reviews });
    } catch (error) {
      next(error);
    }
  }

  async getSingleProductReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const review = await reviewService.getSingleProductReview(
        req.params.productId,
        req.params.reviewId
      );
      res.status(200).json({ status: "success", data: review });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.updateReview(
        req.params.id,
        req.user._id,
        req.body
      );
      res.status(200).json({ status: "success", data: review });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await reviewService.deleteReview(
        req.params.id,
        req.user._id,
        req.user.role
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();
