import { PaginatedResult } from "@/_R/types/global.dto";
import { SubCategory } from "../entities/SubCategory";

export interface SubCategoryRepoType {
  create(category: SubCategory): Promise<SubCategory>;
  findByName(name: string): Promise<SubCategory | null>;
  findById(id: string): Promise<SubCategory | null>;
  findAll(query: any): Promise<PaginatedResult<SubCategory>>;
  update(
    id: string,
    subCategory: Partial<SubCategory>,
  ): Promise<SubCategory | null>;
  softDelete(id: string): Promise<SubCategory | null>;
  restore(id: string): Promise<SubCategory | null>;
  findDeleted(): Promise<SubCategory[]>;
  exists(filter: any): Promise<boolean>;
}
