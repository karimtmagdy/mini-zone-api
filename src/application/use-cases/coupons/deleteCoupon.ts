import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { CouponRepoType } from "@/domain/types/coupon.types";
import { Coupon } from "@/domain/entities/Coupon";
import { AppError } from "@/shared/utils/api.error";

export class DeleteCoupon {
  constructor(
    private couponRepo: CouponRepoType,
    private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer: IUser): Promise<Coupon | null> {
    const coupon = await this.couponRepo.findById(id);
    if (!coupon) {
      throw AppError.notFound("Coupon not found");
    }
    const result = await this.couponRepo.softDelete(id, performer.id);

    await this.recordActivity.execute({
      user: {
        username: performer.username,
        email: performer.email,
        role: performer.role!,
      },
      action: "Coupon archived",
      target: `Coupon: ${coupon.code}`,
      details: { couponId: id },
      timestamp: new Date(),
    });

    return result;
  }
}
