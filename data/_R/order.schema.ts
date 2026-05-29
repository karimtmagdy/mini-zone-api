import { z } from "zod";
import { OrderStatus, PaymentStatus } from "@/_R/order.dto";

export const orderStatusZod = z.nativeEnum(OrderStatus);
export const paymentStatusZod = z.nativeEnum(PaymentStatus);

export const createOrderZod = z.object({
  user: z.string().optional(), // Optional if taken from auth
  orderItems: z
    .array(
      z.object({
        product: z.string(),
        name: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(0),
        image: z.string(),
      }),
    )
    .min(1),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phone: z.string(),
  }),
  paymentMethod: z.string(),
  itemsPrice: z.number().min(0),
  taxPrice: z.number().min(0),
  shippingPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  coupon: z.string().optional(),
  discountAmount: z.number().optional(),
});

export const updateOrderStatusZod = z.object({
  status: orderStatusZod,
});

export const updatePaymentStatusZod = z.object({
  paymentStatus: paymentStatusZod,
  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      updateTime: z.string(),
      emailAddress: z.string(),
    })
    .optional(),
});
