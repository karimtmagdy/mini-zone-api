import { Types } from "mongoose";

export type ReviewDto = {
  comment: string;
  ratings: number;
  user: Types.ObjectId;
  product: Types.ObjectId;
};
export type CreateReviewInput = {
  comment: string;
  ratings: number;
  user: string;
  product: string;
};

export type UpdateReviewInput = {
  comment?: string;
  ratings?: number;
};
