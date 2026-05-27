import { Types } from "mongoose";
import { Product } from "../entities/Product";
import { PaginatedResult } from "@/_R/global.dto";

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
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  isAvailable?: string;
  hasEnoughStock?: (quantity: number) => boolean;
}
export interface ProductRepoType {
  create(product: Product, performerId?: string): Promise<Product>;
  findByName(name: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  findAll(query: any): Promise<PaginatedResult<Product>>;
  update(
    id: string,
    product: Partial<Product>,
    performerId?: string,
  ): Promise<Product | null>;
  softDelete(id: string, performerId?: string): Promise<Product | null>;
  restore(id: string, performerId?: string): Promise<Product | null>;
  findDeleted(): Promise<Product[]>;
  exists(filter: any): Promise<boolean>;
  findTopTen(): Promise<Product[]>;
  findRelated(id: string): Promise<Product[]>;
  findTopRated(): Promise<Product[]>;
  findLatest(): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
  findHighStock(): Promise<Product[]>;
  findOutOfStock(): Promise<Product[]>;
  updateStock(
    id: string,
    stock: number,
    performerId?: string,
  ): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findByBrand(brandId: string): Promise<Product[]>;
  findBySubcategory(subcategoryId: string): Promise<Product[]>;
}
