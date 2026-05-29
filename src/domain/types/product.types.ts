import { Types } from "mongoose";
import { Product } from "../entities/Product";
import {
  IBaseImage,
  IBaseImageArray,
  IBaseMetadata,
  PaginatedResult,
} from "@/types/global.dto";

export const PRODUCT_TRANSITIONS = {
  onboarding: ["active", "archived"],
  active: ["inactive", "archived"],
  inactive: ["active", "archived"],
  archived: ["active"],
} as const;
export type ProductStatus = keyof typeof PRODUCT_TRANSITIONS;
export const PRODUCT_STATUS = Object.keys(
  PRODUCT_TRANSITIONS,
) as ProductStatus[];

export interface IProduct extends IBaseMetadata, IBaseImage, IBaseImageArray {
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
  // images: { url: string; publicId: string }[];
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
