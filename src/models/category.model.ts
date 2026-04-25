import { Schema, model } from "mongoose";
import {
  ICategory,
  CATEGORY_STATUS,
  CategoryStatusEnum,
} from "@/types/category.dto";
import { SchemaFields, SchemaImageFields } from "@/lib/schema/definition";
import {
  applySlugify,
  getSchemaOptions,
  applySoftDelete,
  applyVirtual,
} from "@/lib/schema/fields";

const CategorySchema = new Schema<ICategory>(
  {
    ...SchemaFields,
    ...SchemaImageFields,
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [30, "Category name must be at most 30 characters long"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [
        10,
        "Category description must be at least 10 characters long",
      ],
      maxlength: [
        100,
        "Category description must be at most 100 characters long",
      ],
    },
    status: {
      type: String,
      enum: CATEGORY_STATUS,
      default: CategoryStatusEnum.ACTIVE,
    },
    // products: { type: Number, default: 0 },
  },
  getSchemaOptions("categories"),
);

applySlugify(CategorySchema, "name");
applyVirtual({
  schema: CategorySchema,
  ref: "Product",
  collection: "categories",
});
applySoftDelete(CategorySchema);

export const categoryModel = model<ICategory>("Category", CategorySchema);
