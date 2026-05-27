import { Schema, model } from "mongoose";
import crypto from "crypto";
import { applySoftDelete, getSchemaOptions } from "@/shared/schema/fields";
import { CouponDiscountEnum, ICoupon } from "@/domain/types/coupon.types";

export function generateCouponCode(prefix = "SALE") {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${random}`;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      sparse: true,
    },
    discount: {
      type: {
        type: String,
        enum: Object.values(CouponDiscountEnum),
        required: true,
      },
      value: {
        type: Number,
        required: true,
        min: 0,
      },
      max: Number,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    startsAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiry date is required"],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
  },
  getSchemaOptions("coupons"),
);
applySoftDelete(CouponSchema);

CouponSchema.pre("save", async function (this: any) {
  if (!this.code) {
    this.code = generateCouponCode();
  }
});

// Index for performance
CouponSchema.index({ code: "text", expiresAt: "text" });

export const couponModel = model<ICoupon>("Coupon", CouponSchema);
