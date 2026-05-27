import { z } from "zod/v4";

import { ObjectIdZod } from "../rules/standard.validation.js";
export const CoreReview = z.object({
  comment: z
    .string({ message: "Comment must be a string" })
    .min(3, "Comment is too short"),
  ratings: z
    .number({ message: "Rating must be a number" })
    .min(1, { error: "Rating must be at least 1" })
    .max(5, { error: "Rating must be at most 5" }),
  productId: ObjectIdZod,
});
const createReviewZod = CoreReview.pick({
  comment: true,
  ratings: true,
});
// export const updateReviewZod = CoreReview.shape;
export const updateReviewSchema = z.object({
  comment: z.string().min(3, "Comment is too short").optional(),
  ratings: z.number().min(1).max(5).optional(),
  id: ObjectIdZod,
});

export const getReviewsSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  ratings: z.string().optional(),
  sortBy: z.enum(["ratings", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const getSingleReviewSchema = z.object({
  id: ObjectIdZod,
});

export const getProductReviewSchema = z.object({
  productId: ObjectIdZod,
  reviewId: ObjectIdZod.optional(),
});

export type CreateReview = z.infer<typeof createReviewZod>;
export type UpdateReviewInputSchema = z.infer<typeof updateReviewSchema>;
