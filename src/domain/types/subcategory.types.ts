import { IBaseImage, IBaseMetadata, PaginatedResult } from "@/types/global.dto";
import { SubCategory } from "../entities/SubCategory";

export const SUBCATEGORY_TRANSITIONS = {
  onboarding: ["active", "archived"],
  active: ["inactive", "archived"],
  inactive: ["active", "archived"],
  archived: ["active"],
} as const;

export type SubCategoryStatus = keyof typeof SUBCATEGORY_TRANSITIONS;
export const SUBCATEGORY_STATUS = Object.keys(
  SUBCATEGORY_TRANSITIONS,
) as SubCategoryStatus[];

export interface ISubCategory extends IBaseMetadata, IBaseImage {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  category: string[];
  products: number;
  status: SubCategoryStatus;
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
