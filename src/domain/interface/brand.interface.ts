import { Brand } from "../entities/Brand";
import { PaginatedResult } from "@/_R/types/global.dto";

export interface BrandRepoType {
  create(brand: Brand): Promise<Brand>;
  findByName(name: string): Promise<Brand | null>;
  findById(id: string): Promise<Brand | null>;
  findAll(query: any): Promise<PaginatedResult<Brand>>;
  update(id: string, brand: Partial<Brand>): Promise<Brand | null>;
  softDelete(id: string): Promise<Brand | null>;
  restore(id: string): Promise<Brand | null>;
  findDeleted(): Promise<Brand[]>;
  exists(filter: any): Promise<boolean>;
}
