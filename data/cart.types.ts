import { Types } from "mongoose";

export const CART_STATUS = ["active", "inactive", "completed"] as const;
export type CartStatus = (typeof CART_STATUS)[number];

export type CartItemDto = {
  id?: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  color?: string;
  price: number;
};

export type CartDto = {
  cartItems: CartItemDto[];
  totalCartPrice: number;
  totalPriceAfterDiscount: number | undefined;
  user: Types.ObjectId;
  coupon?: string;
};
