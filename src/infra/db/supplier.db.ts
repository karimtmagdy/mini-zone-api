import { Schema, model, Types } from "mongoose";

const SupplierDB = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "User" },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true },
);
export const supplierDB = model("Supplier", SupplierDB);
