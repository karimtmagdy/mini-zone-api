import { IBaseArchived, IBaseStatus } from "@/types";
import { getStatus } from "@/common/generator/transitions";

export const CATEGORY_TRANSITIONS = {
  active: ["inactive", "archive"],
  inactive: ["active", "archive"],
  archive: ["active"],
} as const;

export const CATEGORY_STATUS = getStatus(CATEGORY_TRANSITIONS);
export type TCategoryStatus = keyof typeof CATEGORY_TRANSITIONS;

export interface ICategoryFields {
  name: string;
  readonly slug: string;
  readonly products: number;
}

export interface ICategory
  extends ICategoryFields, IBaseStatus<TCategoryStatus>, IBaseArchived {}
