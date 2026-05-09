import { PaginatedResult } from "@/_R/types/global.dto";
import { Product } from "../entities/Product";

export interface ProductRepoType {
  create(product: Product): Promise<Product>;
  findByName(name: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  findAll(query: any): Promise<PaginatedResult<Product>>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  softDelete(id: string): Promise<Product | null>;
  restore(id: string): Promise<Product | null>;
  findDeleted(): Promise<Product[]>;
  exists(filter: any): Promise<boolean>;
  findTopTen(): Promise<Product[]>;
  findRelated(id: string): Promise<Product[]>;
  findTopRated(): Promise<Product[]>;
  findLatest(): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
  findHighStock(): Promise<Product[]>;
  findOutOfStock(): Promise<Product[]>;
  updateStock(id: string, stock: number): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findByBrand(brandId: string): Promise<Product[]>;
  findBySubcategory(subcategoryId: string): Promise<Product[]>;
}
