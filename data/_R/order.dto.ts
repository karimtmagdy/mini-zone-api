import { Schema } from "mongoose";

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export interface IOrderItem {
  product: Schema.Types.ObjectId | string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderDto {
  id: string;
  user: Schema.Types.ObjectId | string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    updateTime: string;
    emailAddress: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveredAt?: Date;
  coupon?: Schema.Types.ObjectId | string;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
// export const ORDER_STATUS = ["out_delivery", "confirmed", "returned"] as const;
// export type OrderStatus = (typeof ORDER_STATUS)[number];
// export type OrderDto = {
//   isDelivered: boolean;
//   stripeSessionId?: string; // Stripe Checkout Session ID
// };