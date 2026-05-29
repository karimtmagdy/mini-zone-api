import { PaginatedResult } from "@/types/global.dto";
import { SubCategory } from "../entities/SubCategory";

export const SUBCATEGORY_STATUS = ["active", "inactive", "archived"] as const;
export type SubCategoryStatus = (typeof SUBCATEGORY_STATUS)[number];
export enum SubCategoryEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export interface ISubCategory {
  name: string;
  slug: string;
  description?: string;
  category: string[];
  products: number;
  status: SubCategoryStatus;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  image: {
    url: string;
    publicId: string;
  };
  id?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
export interface SubCategoryRepoType {
  create(category: SubCategory, performerId?: string): Promise<SubCategory>;
  findByName(name: string): Promise<SubCategory | null>;
  findById(id: string): Promise<SubCategory | null>;
  findAll(query: any): Promise<PaginatedResult<SubCategory>>;
  update(
    id: string,
    subCategory: Partial<SubCategory>,
    performerId?: string,
  ): Promise<SubCategory | null>;
  softDelete(id: string, performerId?: string): Promise<SubCategory | null>;
  restore(id: string, performerId?: string): Promise<SubCategory | null>;
  findDeleted(): Promise<SubCategory[]>;
  exists(filter: any): Promise<boolean>;
}
