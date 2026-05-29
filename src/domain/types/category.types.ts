import { IBaseImage, IBaseMetadata, PaginatedResult } from "@/types/global.dto";
import { Category } from "../entities/Category";

export const BRAND_TRANSITIONS = {
  onboarding: ["active", "archived"],
  active: ["inactive", "archived"],
  inactive: ["active", "archived"],
  archived: ["active"],
} as const;

export type CategoryStatus = keyof typeof BRAND_TRANSITIONS;
export const CATEGORY_STATUS = Object.keys(
  BRAND_TRANSITIONS,
) as CategoryStatus[];

export interface ICategory extends IBaseMetadata, IBaseImage {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  products: number;
  slug: string;
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
