import { z } from "zod/v4";
import { ObjectIdZod } from "../rules/standard.validation.js";

export const addToCartSchema = z.object({
  productId: ObjectIdZod,
  color: z.string().optional(),
  quantity: z.number().int().positive().optional().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
  itemId: ObjectIdZod,
});

export const applyCouponSchema = z.object({
  coupon: z.string().min(1, "Coupon name is required"),
});

export type AddToCart = z.infer<typeof addToCartSchema>;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;
export type ApplyCoupon = z.infer<typeof applyCouponSchema>;
