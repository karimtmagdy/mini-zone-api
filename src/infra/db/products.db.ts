import { applySlugify } from "@/common/plugin/plugin-slugify";
import { slugField } from "@/infra/db/fields/slug.field";
import { archiveFields } from "@/infra/db/fields/archive.field";
import { Schema, Types, model } from "mongoose";
import { getStatus } from "@/common/generator/transitions";
import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";
import { VariantDoc, VariantDB } from "./variants.db";
import { IKeyValue, keyValueSchema } from "@/infra/db/fields/key-value.field";

export const PRODUCT_TRANSITIONS = {
  active: ["inactive", "archive"],
  inactive: ["active", "archive"],
  archive: ["active"],
} as const;

export const PRODUCT_STATUS = getStatus(PRODUCT_TRANSITIONS);
export type TProductStatus = (typeof PRODUCT_STATUS)[number];

export interface IProductFields {
  name: string;
  readonly slug: string;
  brandId: Types.ObjectId | null;
  attributes: IKeyValue[];
  variants: VariantDoc[];
}

export interface IProduct
  extends IProductFields, IBaseStatus<TProductStatus>, IBaseArchived {}

export type ProductDoc = IBaseMetaData &
  IProductFields &
  IBaseStatus<TProductStatus> &
  IBaseArchived;

export interface ProductRoute
  extends
    Identifiable,
    Timestamped,
    IProductFields,
    IBaseStatus<TProductStatus>,
    IBaseArchived {}

const ProductDB = new Schema<ProductDoc>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      unique: true,
      index: true,
      minlength: [2, "name must be at least 2 characters long"],
      maxlength: [100, "name must be at most 100 characters long"],
    },
    slug: slugField,
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
      index: true,
      default: null,
    },
    attributes: { type: [keyValueSchema], default: [] },
    variants: { type: [VariantDB], default: [] },
    ...archiveFields,
    status: {
      type: String,
      enum: { values: PRODUCT_STATUS, message: "{VALUE} is not supported" },
      default: "inactive",
      index: true,
    },
  },
  { timestamps: true },
);
applySlugify(ProductDB, "name");

export const productDB = model<ProductDoc>("Product", ProductDB);
