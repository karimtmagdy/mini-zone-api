import { Schema, model } from "mongoose";
import {
  BRAND_STATUS,
  BrandStatusEnum,
  IBrand,
} from "@/domain/types/brand.types";
import { SchemaFields, SchemaImageFields } from "@/shared/schema/definition";
import {
  getSchemaOptions,
  applySoftDelete,
  applySlugify,
  applyVirtual,
} from "@/shared/schema/fields";

const BrandSchema = new Schema<IBrand>(
  {
    ...SchemaFields,
    ...SchemaImageFields,
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      minlength: [2, "name must be at least 2 characters long"],
      maxlength: [30, "name must be at most 30 characters long"],
    },
    status: {
      type: String,
      enum: BRAND_STATUS,
      default: BrandStatusEnum.ACTIVE,
      index: true,
    },
  },
  getSchemaOptions("brands"),
);

BrandSchema.index({ name: "text" });

applySlugify(BrandSchema, "name");
applySoftDelete(BrandSchema);
applyVirtual({
  schema: BrandSchema,
  ref: "Product",
  foreignField: "brand",
});

export const brandModel = model<IBrand>("Brand", BrandSchema);
