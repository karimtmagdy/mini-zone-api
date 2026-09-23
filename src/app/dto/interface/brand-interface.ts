import { BrandEntity } from "@/domain/entities/brand-entity";
import { PaginatedResult, QueryResult } from "@/types";
import {
  TCreateBrandEX,
  TUpdateBrandEX,
} from "@/presentation/validator/brand-zod";

type Entity = BrandEntity;
export interface IBrandImpl {
  create(item: TCreateBrandEX): Promise<Entity>;
  findById(id: string): Promise<Entity | null>;
  restore(id: string): Promise<Entity | null>;
  delete(id: string): Promise<Entity | null>;
  exists(id: string): Promise<boolean>;
  counter(id: string): Promise<boolean>;
  findByName(name: string): Promise<Entity | null>;
  update(id: string, item: TUpdateBrandEX): Promise<Entity | null>;
  archive(id: string): Promise<Entity | null>;
  list(query: Partial<QueryResult>): Promise<PaginatedResult<Entity>>;
}
