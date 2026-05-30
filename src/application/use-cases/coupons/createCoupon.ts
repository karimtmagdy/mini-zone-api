// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { Coupon } from "@/domain/entities/Coupon";
import { CouponRepoType } from "@/domain/types/coupon.types";
import { CreateCouponDTO } from "@/presentation/validation/coupon.zod";
import { AppError } from "@/shared/utils/api.error";
export class CreateCoupon {
  constructor(
    private couponRepo: CouponRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(data: CreateCouponDTO, performer: IUser): Promise<Coupon> {
    if (data.code) {
      const exists = await this.couponRepo.findByCode(data.code);
      if (exists) {
        throw AppError.conflict("Coupon code already exists");
      }
    }
    const coupon = await this.couponRepo.create(data, performer.id);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Coupon created",
    //  target: `Coupon: ${coupon.code}`,
    //  details: { couponId: coupon.id },
    //  timestamp: new Date(),
    // });

    return coupon;
  }
}
