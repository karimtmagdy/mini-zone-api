import { z } from "zod/v4";
import { ObjectIdZod } from "@/shared/schema/shard.schema";
import { queryZod } from "@/shared/schema/query.schema";
import { CouponDiscountEnum } from "@/domain/types/coupon.types";

export const CoreCouponZod = z.object({
  code: z.string().optional(),
  discount: z.object({
    type: z.nativeEnum(CouponDiscountEnum),
    value: z.number().positive(),
    max: z.number().positive().optional(),
  }),
  minOrderAmount: z.number().nonnegative().optional(),
  usageLimit: z.number().int().positive().optional(),
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date(),
  isActive: z.boolean().default(true).optional(),
  usedCount: z.number().default(0).optional(),
  campaignId: ObjectIdZod.optional(),
});

export const createCouponZod = CoreCouponZod;
export const updateCouponZod = CoreCouponZod.partial();
export const validateCouponZod = z.object({ code: z.string() });

export const applyCouponZod = z.object({
  code: z.string(),
  orderAmount: z.number().positive(),
});

export const bulkGenerateZod = z.object({
  count: z.number().int().positive().max(100000),
  discount: CoreCouponZod.shape.discount,
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date(),
  prefix: z.string().optional(),
  campaignId: ObjectIdZod.optional(),
});

export const couponQueryZod = queryZod.extend({
  code: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
export type CreateCouponDTO = z.infer<typeof createCouponZod>;
export type UpdateCouponDTO = z.infer<typeof updateCouponZod>;
export type ApplyCouponDTO = z.infer<typeof applyCouponZod>;
export type GenerateBulkCouponsDTO = z.infer<typeof bulkGenerateZod>;
