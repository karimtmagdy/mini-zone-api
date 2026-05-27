import { PaginatedResult } from "@/_R/global.dto";
import { Category } from "../entities/Category";

export const CATEGORY_STATUS = ["active", "inactive", "archived"] as const;

export type CategoryStatus = (typeof CATEGORY_STATUS)[number];

export enum CategoryStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}
export interface ICategory {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  products: number;
  image: {
    url: string;
    publicId: string;
  };
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
export interface CategoryRepoType {
  create(category: Category, performerId?: string): Promise<Category>;
  findByName(name: string): Promise<Category | null>;
  findById(id: string): Promise<Category | null>;
  findAll(query: any): Promise<PaginatedResult<Category>>;
  update(
    id: string,
    category: Partial<Category>,
    performerId?: string,
  ): Promise<Category | null>;
  softDelete(id: string, performerId?: string): Promise<Category | null>;
  restore(id: string, performerId?: string): Promise<Category | null>;
  findDeleted(): Promise<Category[]>;
  exists(filter: any): Promise<boolean>;
}
