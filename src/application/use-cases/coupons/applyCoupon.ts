import { CouponRepoType } from "@/domain/types/coupon.types";
import { AppError } from "@/shared/utils/api.error";
import { CouponDiscountEnum } from "@/domain/types/coupon.types";

export class ApplyCoupon {
  constructor(private couponRepo: CouponRepoType) {}

  async execute(code: string, orderAmount: number) {
    const coupon = await this.couponRepo.findByCode(code);

    if (!coupon || !coupon.isActive || coupon.deletedAt) {
      throw AppError.notFound("Invalid or inactive coupon");
    }

    if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) {
      throw AppError.badRequest("Coupon not started yet");
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw AppError.badRequest("Coupon expired");
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw AppError.badRequest("Coupon usage limit reached");
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      throw AppError.badRequest(
        `Minimum order amount of ${coupon.minOrderAmount} not reached`,
      );
    }

    let discountAmount = 0;
    if (coupon.discount.type === CouponDiscountEnum.PERCENTAGE) {
      discountAmount = orderAmount * (coupon.discount.value / 100);
      if (coupon.discount.max) {
        discountAmount = Math.min(discountAmount, coupon.discount.max);
      }
    } else {
      discountAmount = coupon.discount.value;
    }

    return {
      coupon: coupon.code,
      discountAmount,
      finalPrice: Math.max(0, orderAmount - discountAmount),
    };
  }
}
