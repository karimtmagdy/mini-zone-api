import { CouponRepoType } from "@/domain/types/coupon.types";
import { Coupon } from "@/domain/entities/Coupon";
import { AppError } from "@/shared/utils/api.error";

export class GetCouponById {
  constructor(private couponRepo: CouponRepoType) {}

  async execute(id: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findById(id);
    if (!coupon) {
      throw AppError.notFound("Coupon not found");
    }
    return coupon;
  }
}
