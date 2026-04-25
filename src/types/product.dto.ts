import { StandardTypes } from "@/types/global.dto";
import { Types } from "mongoose";

export const PRODUCT_STATUS = [
  "active",
  "inactive",
  "archived",
  "trash",
] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];
export enum ProductStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
  TRASH = "trash",
}
export interface IProduct extends StandardTypes {
  name: string;
  slug: string;
  //   description: string;
  price: number;
  quantity: number;
  //   images: string[];
  category: string | Types.ObjectId;
  //   subcategory: string;
  brand: string | Types.ObjectId;
  //   rating: number;
  //   numReviews: number;
  //   isFeatured: boolean;
  status: ProductStatus;
}
