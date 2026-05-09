import { ProductStatus } from "@/domain/types/product.types";

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  discount: number;
  sold: number;
  colors: string[];
  images: { url: string; publicId: string }[];
  category: string[];
  subcategory: string[];
  brand: string;
  status: ProductStatus;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  discount?: number;
  sold?: number;
  colors?: string[];
  images?: { url: string; publicId: string }[];
  category?: string[];
  subcategory?: string[];
  brand?: string;
  status?: ProductStatus;
}
