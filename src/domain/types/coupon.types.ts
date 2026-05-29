import { PaginatedResult } from "@/types/global.dto";
import { Coupon } from "../entities/Coupon";

export enum CouponDiscountEnum {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}
export const COUPON_STATUS = ["active", "inactive"] as const;
export type CouponDiscountStatus = (typeof COUPON_STATUS)[number];

export enum CouponEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export interface IDiscount {
  type: CouponDiscountEnum;
  value: number;
  max?: number;
}

export interface ICoupon {
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
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
