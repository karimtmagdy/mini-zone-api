import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";
import {
  ICategoryFields,
  TCategoryStatus,
} from "@/domain/types/category.types";

export type CategoryDoc = IBaseMetaData &
  ICategoryFields &
  IBaseStatus<TCategoryStatus> &
  IBaseArchived;

export interface CategoryRoute
  extends
    Identifiable,
    Timestamped,
    ICategoryFields,
    IBaseStatus<TCategoryStatus>,
    IBaseArchived {}
