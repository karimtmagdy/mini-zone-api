import { Schema, model } from "mongoose";
import { IBrand, BRAND_STATUS, BrandStatusEnum } from "@/types/brand.dto";
import { SchemaFields, SchemaImageFields } from "@/lib/schema/definition";
import {
  getSchemaOptions,
  applySoftDelete,
  applySlugify,
} from "@/lib/schema/fields";

const BrandSchema = new Schema<IBrand>(
  {
    ...SchemaFields,
    ...SchemaImageFields,
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [30, "Name must be at most 30 characters long"],
    },
    status: {
      type: String,
      enum: BRAND_STATUS,
      default: BrandStatusEnum.ACTIVE,
    },
    products: { type: Number, default: 0 },
  },
  getSchemaOptions("brands"),
);
applySlugify(BrandSchema, "name");
applySoftDelete(BrandSchema);

export const brandModel = model<IBrand>("Brand", BrandSchema);
