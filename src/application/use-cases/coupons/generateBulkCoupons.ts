import { CouponRepoType } from "@/domain/types/coupon.types";
import { GenerateBulkCouponsDTO } from "@/presentation/validation/coupon.zod";
import { Coupon } from "@/domain/entities/Coupon";
import { generateCouponCode } from "@/infrastructure/database/coupon.model";

export class GenerateBulkCoupons {
  constructor(private couponRepo: CouponRepoType) {}

  async execute(data: GenerateBulkCouponsDTO): Promise<Coupon[]> {
    const {
      count,
      discount,
      expiresAt,
      prefix = "PROMO",
      startsAt,
      campaignId,
    } = data;
    const coupons: Partial<Coupon>[] = [];

    for (let i = 0; i < count; i++) {
      const couponData: Partial<Coupon> = {
        code: generateCouponCode(prefix),
        discount,
        expiresAt,
        isActive: true,
        usedCount: 0,
      };

      if (startsAt) couponData.startsAt = startsAt;
      if (campaignId) couponData.campaignId = campaignId;

      coupons.push(couponData);
    }

    return await this.couponRepo.insertMany(coupons);
  }
}
