import { Schema, model } from "mongoose";
import { IBrand } from "../unity/interface/brand.interface.js";
import { BRAND_STATUS } from "../unity/types/brand.types.js";
import {
  SchemaFields,
  applySlugMiddleware,
  getSchemaOptions,
  applySoftDeleteMiddleware,
  SchemaImageFields,
} from "./standard.fields.js";
import { BrandStatusEnum } from "../unity/enums/brand.enums.js";

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

applySlugMiddleware(BrandSchema, "name");
applySoftDeleteMiddleware(BrandSchema);
// BrandSchema.index({ name: 1 });
export const brandModel = model<IBrand>("Brand", BrandSchema);
