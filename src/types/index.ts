import { Types } from "mongoose";

export interface Identifiable {
  readonly id: string;
}

export interface Timestamped {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Archivable {
  isArchived: boolean;
  archivedAt: Date | null;
  archive(): void;
  unarchive(): void;
}

export interface Activatable {
  isActive: boolean;
}

export interface StatusAble<TStatus extends string> {
  status: TStatus;
  transition(to: TStatus): void;
}

export interface IBaseMetaData {
  readonly _id: Types.ObjectId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface IBaseArchived {
  archivedAt: Date | null;
  isArchived: boolean;
}

export interface IBaseStatus<TStatus extends string> {
  status: TStatus;
}

export type BulkAction = "delete" | "update" | "restore" | "archive";
export type Resource =
  | "users"
  | "products"
  | "categories"
  | "subcategories"
  | "brands"
  | "employees"
  | "customers";
export interface MaxBulk {
  action: BulkAction;
  resource: Resource;
  max?: number;
}
export interface IBaseImage {
  url: string;
  publicId: string;
}

export interface PaginationMeta {
  total: number;
  // results: number;
  limit: number;
  pages: number;
  page: number;
  // hasNextPage: number;
  // hasPrevPage: boolean;
}
export interface QueryResult {
  page: number;
  limit: number;
  search: string;
  sort: string;
  // sortOrder: string;
  // skip: string;
  fields: string;
  // status: string;
}
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
