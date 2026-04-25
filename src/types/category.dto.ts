import { StandardTypes } from "@/types/global.dto";

export const CATEGORY_STATUS = ["active", "inactive", "archived"] as const;
export type CategoryStatus = (typeof CATEGORY_STATUS)[number];
export enum CategoryStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}
export interface ICategory extends StandardTypes {
  name: string;
  description: string;
  status: CategoryStatus;
  products: number;
}
