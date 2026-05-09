import { PaginatedResult } from "@/_R/types/global.dto";
import { Category } from "../entities/Category";

export interface CategoryRepoType {
  create(category: Category): Promise<Category>;
  findByName(name: string): Promise<Category | null>;
  findById(id: string): Promise<Category | null>;
  findAll(query: any): Promise<PaginatedResult<Category>>;
  update(id: string, category: Partial<Category>): Promise<Category | null>;
  softDelete(id: string): Promise<Category | null>;
  restore(id: string): Promise<Category | null>;
  findDeleted(): Promise<Category[]>;
  exists(filter: any): Promise<boolean>;
}
