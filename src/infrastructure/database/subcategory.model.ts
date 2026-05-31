import {
  applySlugify,
  applySoftDelete,
  applyVirtual,
  getSchemaOptions,
} from "@/shared/schema/fields";
import { SchemaFields, SchemaImageFields } from "@/shared/schema/definition";
import {
  ISubCategory,
  SUBCATEGORY_STATUS,
} from "@/domain/types/subcategory.types";
import { model, Schema, Types } from "mongoose";

const SubCategorySchema = new Schema<ISubCategory>(
  {
    ...SchemaFields,
    ...SchemaImageFields,
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [32, "Name must be at most 32 characters"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must be at most 500 characters"],
    },
    category: [
      { type: Types.ObjectId, ref: "Category", required: true, index: true },
    ],
    status: {
      type: String,
      enum: SUBCATEGORY_STATUS,
      default: "onboarding",
      index: true,
    },
  },
  getSchemaOptions("subcategories"),
);

SubCategorySchema.index({ name: "text", description: "text" });

applySlugify(SubCategorySchema, "name");
applySoftDelete(SubCategorySchema);
applyVirtual({
  schema: SubCategorySchema,
  ref: "Product",
  foreignField: "subcategory",
});

export const subCategoryModel = model<ISubCategory>(
  "SubCategory",
  SubCategorySchema,
);
