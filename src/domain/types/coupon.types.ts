import { IBaseMetadata, PaginatedResult } from "@/types/global.dto";
import { Coupon } from "../entities/Coupon";

export const COUPON_TRANSITIONS = {
  active: ["inactive"],
  inactive: ["active"],
} as const;
export enum CouponDiscountStatusEnum   {
  FIXED="fixed",
  PERCENTAGE="percentage"
};
// EXPIRED = "expired",
export type CouponDiscountStatus = "fixed" | "percentage";
export type CouponStatus = keyof typeof COUPON_TRANSITIONS;
export const COUPON_STATUS = Object.keys(COUPON_TRANSITIONS) as CouponStatus[];

export interface IDiscount {
  type: CouponDiscountStatus;
  value: number;
  max?: number;
}

export interface ICoupon extends IBaseMetadata {
  id: string;
  code: string;
  discount: IDiscount;
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount: number;
  startsAt?: Date;
  expiresAt: Date;
  isActive: boolean;
  campaignId?: string;
}

export interface CouponRepoType {
  create(coupon: Partial<Coupon>, performerId?: string): Promise<Coupon>;
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  findAll(query: any): Promise<PaginatedResult<Coupon>>;
  update(
    id: string,
    coupon: Partial<Coupon>,
    performerId?: string,
  ): Promise<Coupon | null>;
  delete(id: string): Promise<void>;
  deleteBulk(ids: string[]): Promise<void>;
  softDelete(id: string, performerId?: string): Promise<Coupon | null>;
  restore(id: string, performerId?: string): Promise<Coupon | null>;
  findDeleted(): Promise<Coupon[]>;
  incrementUsedCount(id: string): Promise<Coupon | null>;
  insertMany(coupons: Partial<Coupon>[]): Promise<Coupon[]>;
}
