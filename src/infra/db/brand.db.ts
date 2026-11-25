import { Schema, model } from "mongoose";
import { BRAND_STATUS } from "@/domain/types/brand.types";
import { BrandDoc } from "@/domain/dto/brand.dto";
import { applySlugify } from "@/common/plugin/plugin-slugify";
import { applyVirtual } from "@/common/plugin/plugin-virtual";
import { slugField } from "@/infra/db/fields/slug.field";
import { archiveFields } from "@/infra/db/fields/archive.field";

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
    slug: slugField,
    ...archiveFields,
  },
  { timestamps: true },
);
applySlugify(BrandDB, "name");
applyVirtual({ schema: BrandDB, ref: "Product", foreign: "brandId" });
BrandDB.index({ name: "text" });
// BrandDB.index({ archivedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90 days
export const brandDB = model<BrandDoc>("Brands", BrandDB);
