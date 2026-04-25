import { Schema, Types, model } from "mongoose";
import {
  IProduct,
  PRODUCT_STATUS,
  ProductStatusEnum,
} from "@/types/product.dto";
import { SchemaFields, SchemaImageFields } from "@/lib/schema/definition";
import {
  getSchemaOptions,
  applySoftDelete,
  applySlugify,
} from "@/lib/schema/fields";

const ProductSchema = new Schema<IProduct>(
  {
    ...SchemaFields,
    ...SchemaImageFields,
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [30, "Name must be at most 30 characters long"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be at least 0"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity must be at least 0"],
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    status: {
      type: String,
      enum: PRODUCT_STATUS,
      default: ProductStatusEnum.ACTIVE,
    },
  },
  getSchemaOptions("products"),
);
applySlugify(ProductSchema, "name");
applySoftDelete(ProductSchema);

export const productModel = model<IProduct>("Product", ProductSchema);
