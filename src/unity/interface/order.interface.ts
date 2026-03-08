import { Types } from "mongoose";

export type OrderItemDto = {
  product: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type OrderDto = {
  id: Types.ObjectId;
  user: Types.ObjectId;
  orderItems: OrderItemDto[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string; // Stripe Payment Intent ID
    status: string;
    updateTime: Date;
    emailAddress: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  stripeSessionId?: string; // Stripe Checkout Session ID
};
