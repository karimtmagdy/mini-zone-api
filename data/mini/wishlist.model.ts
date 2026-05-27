import { model, Schema, Types } from "mongoose";
import { getSchemaOptions } from "./standard.fields.js";

const WishlistSchema = new Schema<any>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Wishlist must belong to a user"],
      unique: true,
    },
    products: [
      {
        type: Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  getSchemaOptions("wishlist"),
);
export const WishlistModel = model<any>("Wishlist", WishlistSchema);
