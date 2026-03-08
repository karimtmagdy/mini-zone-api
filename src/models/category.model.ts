import { Schema, model } from "mongoose";
import { ICategory } from "../unity/interface/category.interface.js";
import { CATEGORY_STATUS } from "../unity/types/category.types.js";
import {
  SchemaFields,
  applySlugMiddleware,
  getSchemaOptions,
  applySoftDeleteMiddleware,
  SchemaImageFields,
} from "./standard.fields.js";
import { CategoryStatusEnum } from "../unity/enums/category.enums.js";

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
    products: { type: Number, default: 0 },
  },
  getSchemaOptions("categories"),
);

applySlugMiddleware(CategorySchema, "name");
applySoftDeleteMiddleware(CategorySchema);
CategorySchema.index({ name: 1 });
export const categoryModel = model<ICategory>("Category", CategorySchema);
