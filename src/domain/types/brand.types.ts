import { IBaseImage, IBaseMetadata, PaginatedResult } from "@/types/global.dto";
import { Brand } from "../entities/Brand";
import { isValidTransition as genericIsValidTransition } from "@/shared/utils/state-machine";

export const BRAND_TRANSITIONS = {
  onboarding: ["active", "archived"],
  active: ["inactive", "archived"],
  inactive: ["active", "archived"],
  archived: ["active"],
} as const;

export type BrandStatus = keyof typeof BRAND_TRANSITIONS;
export const BRAND_STATUS = Object.keys(BRAND_TRANSITIONS) as BrandStatus[];

export function isValidTransition(
  currentStatus: BrandStatus,
  newStatus: BrandStatus,
): boolean {
  return genericIsValidTransition(BRAND_TRANSITIONS, currentStatus, newStatus);
}
export interface IBrand extends IBaseMetadata, IBaseImage {
  id: string;
  name: string;
  status: BrandStatus;
  products: number;
  slug: string;
}
export interface BrandRepoType {
  create(brand: Brand, performerId?: string): Promise<Brand>;
  findByName(name: string): Promise<Brand | null>;
  findById(id: string): Promise<Brand | null>;
  findAll(query: any): Promise<PaginatedResult<Brand>>;
  update(
    id: string,
    brand: Partial<Brand>,
    performerId?: string,
  ): Promise<Brand | null>;
  softDelete(id: string, performerId?: string): Promise<Brand | null>;
  restore(id: string, performerId?: string): Promise<Brand | null>;
  findDeleted(): Promise<Brand[]>;
  exists(filter: any): Promise<boolean>;
}
