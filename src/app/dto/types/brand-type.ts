import { getStatus } from "@/shared/generator/transitions";
import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";

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

export type BrandDoc = IBaseMetaData & IBrand;

export interface BrandRoute
  extends
    Identifiable,
    Timestamped,
    IBrandFields,
    IBaseStatus<TBrandStatus>,
    IBaseArchived {}
