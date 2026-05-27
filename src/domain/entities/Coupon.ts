import { ICoupon, IDiscount } from "../types/coupon.types";

export class Coupon {
  // export class Coupon implements ICoupon {
  public readonly id!: string;
  public code!: string;
  public discount!: IDiscount;
  public usedCount!: number;
  public expiresAt!: Date;
  public isActive!: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
  public minOrderAmount?: number;
  public usageLimit?: number;
  public startsAt?: Date;
  public campaignId?: string;
  public deletedAt?: Date | null;
  constructor(data: Partial<Coupon>) {
    Object.assign(this, data);
  }
}
