import { StandardTypes } from "@/types/global.dto";

export const BRAND_STATUS = [
  "active",
  "inactive",
  "archived",
  "trash",
] as const;
export type BrandStatus = (typeof BRAND_STATUS)[number];
export enum BrandStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
  TRASH = "trash",
}
export interface IBrand extends StandardTypes {
  name: string;
  status: BrandStatus;
  products: number;
}
