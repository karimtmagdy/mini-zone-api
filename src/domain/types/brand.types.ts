import { getStatus } from "@/common/generator/transitions";
import { IBaseArchived, IBaseStatus } from "@/types";

export const BRAND_TRANSITIONS = {
  active: ["inactive", "archive"],
  inactive: ["active", "archive"],
  archive: ["active"],
} as const;

export const BRAND_STATUS = getStatus(BRAND_TRANSITIONS);
export type TBrandStatus = (typeof BRAND_STATUS)[number];

export interface IBrandFields {
  name: string;
  readonly slug: string;
  readonly products: number;
}

export interface IBrand
  extends IBrandFields, IBaseStatus<TBrandStatus>, IBaseArchived {}
