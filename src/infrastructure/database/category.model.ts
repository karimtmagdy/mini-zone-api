import { Schema, model } from "mongoose";
import {
  applySlugify,
  applySoftDelete,
  applyVirtual,
  getSchemaOptions,
} from "@/shared/schema/fields";
import { CATEGORY_STATUS, ICategory } from "@/domain/types/category.types";
import { SchemaFields, SchemaImageFields } from "@/shared/schema/definition";

const CategorySchema = new Schema<ICategory>(
  {
    ...SchemaFields,
    ...SchemaImageFields,
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      minlength: [3, "category name must be at least 3 characters long"],
      maxlength: [30, "category name must be at most 30 characters long"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [
        10,
        "category description must be at least 10 characters long",
      ],
      maxlength: [
        100,
        "category description must be at most 100 characters long",
      ],
    },
    status: {
      type: String,
      enum: CATEGORY_STATUS,
      default: "onboarding",
      index: true,
    },
  },
  getSchemaOptions("categories"),
);

CategorySchema.index({ name: "text", description: "text" });

applySlugify(CategorySchema, "name");
applySoftDelete(CategorySchema);
applyVirtual({
  schema: CategorySchema,
  ref: "Product",
  foreignField: "category",
});

CategorySchema.virtual("subcategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "category",
});

export const categoryModel = model<ICategory>("Category", CategorySchema);
