// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { CouponRepoType } from "@/domain/types/coupon.types";
import { Coupon } from "@/domain/entities/Coupon";
import { UpdateCouponDTO } from "@/presentation/validation/coupon.zod";
import { AppError } from "@/shared/utils/api.error";

export class UpdateCoupon {
  constructor(
    private couponRepo: CouponRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(
    id: string,
    data: UpdateCouponDTO,
    performer: IUser,
  ): Promise<Coupon | null> {
    const coupon = await this.couponRepo.findById(id);
    if (!coupon) {
      throw AppError.notFound("Coupon not found");
    }

    if (data.code && data.code !== coupon.code) {
      const exists = await this.couponRepo.findByCode(data.code);
      if (exists) {
        throw AppError.conflict("Coupon code already exists");
      }
    }

    const updated = await this.couponRepo.update(id, data, performer.id);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Coupon updated",
    //  target: `Coupon: ${updated?.code || id}`,
    //  details: { couponId: id, updates: data },
    //  timestamp: new Date(),
    // });

    return updated;
  }
}
