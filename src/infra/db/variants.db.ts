import { Schema, model } from "mongoose";
import {
  IBaseArchived,
  IBaseMetaData,
  IBaseStatus,
  Identifiable,
  Timestamped,
} from "@/types";
import { getStatus } from "@/common/generator/transitions";

export const VARIANTS_TRANSITIONS = {
  active: ["inactive"],
  inactive: ["active"],
} as const;

export const VARIANTS_STATUS = getStatus(VARIANTS_TRANSITIONS);
export type TVariantStatus = (typeof VARIANTS_STATUS)[number];

export interface IVariantFields {
  finalPrice: number;
  price: number;
  stock: number;
  colors: IColor[];
  highlights: string[];
  specification: ISpecGroup[];
}
export interface IVariant
  extends IVariantFields, IBaseStatus<TVariantStatus>, IBaseArchived {}

export type VariantDoc = IBaseMetaData &
  IVariantFields &
  IBaseStatus<TVariantStatus> &
  IBaseArchived;

export interface VariantRoute
  extends
    Identifiable,
    Timestamped,
    IVariantFields,
    IBaseStatus<TVariantStatus>,
    IBaseArchived {}

export interface IColor {
  name: string;
  hex: string | null;
}

export interface ISpecItem {
  name: string;
  values: string[];
}

export interface ISpecGroup {
  group: string;
  items: ISpecItem[];
}

const ColorDB = new Schema<IColor>(
  {
    name: { type: String, trim: true, lowercase: true, required: true },
    hex: { type: String, trim: true, default: null },
  },
  { _id: false },
);

const SpecItemDB = new Schema<ISpecItem>(
  {
    name: { type: String, trim: true, required: true },
    values: { type: [String], default: [] },
  },
  { _id: false },
);

const SpecGroupDB = new Schema<ISpecGroup>(
  {
    group: { type: String, trim: true, lowercase: true, required: true },
    items: { type: [SpecItemDB], default: [] },
  },
  { _id: false },
);

export const VariantDB = new Schema<VariantDoc>(
  {
    // costPrice: { type: Number, default: 0, min: 0 },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price must be at least 0"],
    },
    finalPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    colors: { type: [ColorDB], default: [] },
    highlights: { type: [String], default: [] },
    specification: { type: [SpecGroupDB], default: [] },
    status: {
      type: String,
      enum: { values: VARIANTS_STATUS, message: "{VALUE} is not supported" },
      default: "active",
    },
  },
  { timestamps: true },
);

export const variantDB = model<VariantDoc>("Variant", VariantDB);
