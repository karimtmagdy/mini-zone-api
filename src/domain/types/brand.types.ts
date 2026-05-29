import { PaginatedResult } from "@/types/global.dto";
import { Brand } from "../entities/Brand";
import { isValidTransition as genericIsValidTransition } from "@/shared/utils/state-machine";

export const brandTransitions = {
  onboarding: ["active", "archived"],
  active: ["inactive", "archived"],
  inactive: ["active", "archived"],
  archived: ["active"],
} as const;

export type BrandStatus = keyof typeof brandTransitions;
export const BRAND_STATUS = Object.keys(brandTransitions) as BrandStatus[];
export enum BrandStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ONBOARDING = "onboarding",
  ARCHIVED = "archived",
}

export function isValidTransition(
  currentStatus: BrandStatus,
  newStatus: BrandStatus,
): boolean {
  return genericIsValidTransition(brandTransitions, currentStatus, newStatus);
}
export interface IBrand {
  id: string;
  name: string;
  status: BrandStatus;
  products: number;
  image: {
    url: string;
    publicId: string;
  };
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
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
