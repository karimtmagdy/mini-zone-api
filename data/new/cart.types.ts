export const CART_STATUS = ["active", "inactive", "completed"] as const;
export type CartStatus = (typeof CART_STATUS)[number];

export type CartItemDto = {
  id?: string;
  product: string;
  quantity: number;
  color?: string;
  price: number;
};

export type CartDto = {
  cartItems: CartItemDto[];
  totalCartPrice: number;
  totalPriceAfterDiscount: number | undefined;
  user: string;
  coupon?: string;
};
