// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { CouponRepoType } from "@/domain/types/coupon.types";
export class DeleteBulkCoupons {
  constructor(
    private couponRepo: CouponRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(ids: string[], performer: IUser): Promise<void> {
    await this.couponRepo.deleteBulk(ids);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Bulk deleted coupons",
    //  target: `${ids.length} coupons`,
    //  details: { ids },
    //  timestamp: new Date(),
    // });
  }
}
