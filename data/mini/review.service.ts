import { AppError } from "@/middleware/api.error";
import { ReviewRepository, reviewRepo } from "@/repositories/review.repository";
import {
  CreateReviewInputSchema,
  UpdateReviewInputSchema,
} from "@/schema/review.schema";
import { IReview } from "@/types/review.dto";

export class ReviewService {
  constructor(private repo: ReviewRepository) {}

  async createReview(data: {
    body: CreateReviewInputSchema;
    productId: string;
    userId: string;
  }) {
    const { body, productId, userId } = data;

    // Check if user already reviewed this product
    const existingReview = await this.repo.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      throw new AppError(400, "You have already reviewed this product");
    }

    return await this.repo.create({
      ...body,
      product: productId as any,
      user: userId as any,
    } as Partial<IReview>);
  }

  async getAllReviews(filter: Record<string, any> = {}) {
    return await this.repo.findAll(filter);
  }

  async getReviewById(id: string) {
    const review = await this.repo.findById(id);
    if (!review) throw new AppError(404, "Review not found");
    return review;
  }

  async getProductReviews(productId: string) {
    return await this.repo.findByProduct(productId);
  }

  async getSingleProductReview(productId: string, reviewId: string) {
    const review = await this.repo.findOne({
      _id: reviewId,
      product: productId,
    });
    if (!review) throw new AppError(404, "Review not found for this product");
    return review;
  }

  async updateReview(
    id: string,
    userId: string,
    data: UpdateReviewInputSchema
  ) {
    const review = await this.getReviewById(id);

    // Only owner can update
    if (review.user._id.toString() !== userId) {
      throw new AppError(403, "You are not allowed to update this review");
    }

    return await this.repo.update(id, data);
  }

  async deleteReview(id: string, userId: string, role: string) {
    const review = await this.getReviewById(id);

    // Only owner or admin/manager can delete
    const isOwner = review.user._id.toString() === userId;
    const isPrivileged = ["admin", "manager"].includes(role);

    if (!isOwner && !isPrivileged) {
      throw new AppError(403, "You are not allowed to delete this review");
    }

    return await this.repo.delete(id);
  }
}

export const reviewService = new ReviewService(reviewRepo);
