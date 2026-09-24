import { CategoryDoc } from "@/app/dto/category.dto";
import { applySlugify } from "@/common/plugin/plugin-slugify";
import { applyVirtual } from "@/common/plugin/plugin-virtual";
import { CATEGORY_STATUS } from "@/domain/types/category.types";
import { Schema, model } from "mongoose";

const CategoryDB = new Schema<CategoryDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      minlength: [3, "category name must be at least 3 characters long"],
      maxlength: [30, "category name must be at most 30 characters long"],
    },
    status: {
      type: String,
      enum: { values: CATEGORY_STATUS, message: "{VALUE} is not supported" },
      default: "active",
      index: true,
    },
    slug: { type: String, trim: true, lowercase: true, unique: true },
    isArchived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date, select: false, default: null },
  },
  { timestamps: true },
);
applySlugify(CategoryDB, "name");
applyVirtual({ schema: CategoryDB, ref: "Product", foreign: "categoryId" });

CategoryDB.index({ name: "text" });
export const categoryDB = model<CategoryDoc>("Categories", CategoryDB);
// // applySoftDelete(CategorySchema);

// CategorySchema.virtual("subcategories", {
//   ref: "SubCategory",
//   localField: "_id",
//   foreignField: "category",
// });
