import { Types } from "mongoose";

export const PRODUCT_STATUS = [
  "active",
  "inactive",
  "draft",
  "archived",
] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];
export enum ProductStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
  ARCHIVED = "archived",
}
export interface IProduct {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  discount: number;
  sold: number;
  colors: string[];
  images: { url: string; publicId: string }[];
  category: (string | Types.ObjectId)[];
  subcategory: (string | Types.ObjectId)[];
  brand: string | Types.ObjectId;
  status: ProductStatus;
  ratings?: {
    average: number;
    count: number;
  };
  reviews?: (string | Types.ObjectId)[];
  tags?: string[];
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  isAvailable?: string;
  hasEnoughStock?: (quantity: number) => boolean;
}
