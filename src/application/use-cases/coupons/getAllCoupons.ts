import { CouponRepoType } from "@/domain/types/coupon.types";
import { PaginatedResult } from "@/_R/global.dto";
import { Coupon } from "@/domain/entities/Coupon";

export class GetAllCoupons {
  constructor(private couponRepo: CouponRepoType) {}

  async execute(query: any): Promise<PaginatedResult<Coupon>> {
    const mappedQuery = { ...query };
    if (mappedQuery.status === "active") {
      mappedQuery.isActive = "true";
      delete mappedQuery.status;
    } else if (mappedQuery.status === "inactive") {
      mappedQuery.isActive = "false";
      delete mappedQuery.status;
    }
    return await this.couponRepo.findAll(mappedQuery);
  }
}
