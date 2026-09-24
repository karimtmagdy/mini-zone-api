import { PaginatedResult, QueryResult } from "@/types";
import { CategoryEntity } from "@/domain/entities/category.entity";
import {
  TCreateCategoryEX,
  TUpdateCategoryEX,
} from "@/presentation/validator/category.zod";

type Entity = CategoryEntity;
export interface ICategoryImpl {
  create(item: TCreateCategoryEX): Promise<Entity>;
  findById(id: string): Promise<Entity | null>;
  restore(id: string): Promise<Entity | null>;
  delete(id: string): Promise<Entity | null>;
  exists(id: string): Promise<boolean>;
  // counter(id: string): Promise<boolean>;
  findByName(name: string): Promise<Entity | null>;
  update(id: string, item: TUpdateCategoryEX): Promise<Entity | null>;
  archive(id: string): Promise<Entity | null>;
  list(query: Partial<QueryResult>): Promise<PaginatedResult<Entity>>;
}
