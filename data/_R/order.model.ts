import { Schema, model, Types } from "mongoose";
import { OrderDto, OrderStatus, PaymentStatus } from "@/_R/order.dto";
import { getSchemaOptions } from "@/shared/schema/fields";

const orderSchema = new Schema<OrderDto>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        product: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: "Stripe" },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String,
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    deliveredAt: { type: Date },
    coupon: { type: Types.ObjectId, ref: "Coupon" },
    discountAmount: { type: Number, default: 0.0 },
  },
  getSchemaOptions("orders"),
);

export const OrderModel = model<OrderDto>("Order", orderSchema);
// isDelivered: { type: Boolean, required: true, default: false },
// stripeSessionId: String,
