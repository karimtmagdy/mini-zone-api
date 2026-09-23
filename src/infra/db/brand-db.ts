import { Schema, model } from "mongoose";
import { BRAND_STATUS, BrandDoc } from "@/app/dto/types/brand-type";
import { applySlugify } from "@/shared/plugin/plugin-slugify";

const BrandDB = new Schema<BrandDoc>(
  {
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
      enum: { values: BRAND_STATUS, message: "{VALUE} is not supported" },
      default: "inactive",
      index: true,
    },
    slug: { type: String, trim: true, lowercase: true, unique: true },
    isArchived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date, select: false, default: null },
  },
  { timestamps: true },
);
applySlugify(BrandDB, "name");
BrandDB.virtual("products", {
  ref: "Product",
  foreignField: "brandId",
  localField: "_id",
});
// applyVirtual({ schema: BrandDB, ref: "Product", foreign: "brand" });
BrandDB.index({ name: "text" });
export const brandDB = model<BrandDoc>("Brands", BrandDB);
