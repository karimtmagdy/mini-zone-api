// import { model, Schema, Types } from "mongoose";
// import { ICart } from "@/types/cart.dto";

// const CartSchema = new Schema<ICart>(
//   {
//     cartItems: [
//       {
//         product: { type: Types.ObjectId, ref: "Product" },
//         quantity: { type: Number, default: 1 },
//         color: String,
//         price: Number,
//       },
//     ],
//     // totalAmount = totalCartPrice + shippingCost
//     totalCartPrice: { type: Number, default: 0 },
//     totalPriceAfterDiscount: { type: Number },
//     user: { type: Types.ObjectId, ref: "User", required: true },
//     coupon: String,
//   },
 
// );

// export const Cart = model<ICart>("Cart", CartSchema);
