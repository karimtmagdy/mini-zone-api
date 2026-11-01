import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";
import { IBrandFields, TBrandStatus } from "@/domain/types/brand.types";

export type BrandDoc = IBaseMetaData &
  IBrandFields &
  IBaseStatus<TBrandStatus> &
  IBaseArchived;

export interface BrandRoute
  extends
    Identifiable,
    Timestamped,
    IBrandFields,
    IBaseStatus<TBrandStatus>,
    IBaseArchived {}
