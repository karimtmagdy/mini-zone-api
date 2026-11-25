import { EmployeeEntity } from "@/domain/entities/employee.entity";
import { PaginatedResult, QueryResult } from "@/types";
import {
  TCreateEmployeeEX,
  TUpdateEmployeeEX,
} from "@/presentation/validator/employee.zod";

type Entity = EmployeeEntity;

export interface IEmployeeImpl {
  create(item: TCreateEmployeeEX & { code: string }): Promise<Entity>;
  findById(id: string): Promise<Entity | null>;
  findByUserId(userId: string): Promise<Entity | null>;
  findByCode(code: string): Promise<Entity | null>;
  exists(id: string): Promise<boolean>;
  hasAdmin(): Promise<boolean>;
  update(id: string, item: TUpdateEmployeeEX): Promise<Entity | null>;
  archive(id: string): Promise<Entity | null>;
  restore(id: string): Promise<Entity | null>;
  delete(id: string): Promise<Entity | null>;
  list(query: Partial<QueryResult>): Promise<PaginatedResult<Entity>>;
}
