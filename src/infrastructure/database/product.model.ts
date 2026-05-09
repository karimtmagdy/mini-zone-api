import { Schema, Types, model } from "mongoose";
import {
  IProduct,
  PRODUCT_STATUS,
  ProductStatusEnum,
} from "@/domain/types/product.types";
import { SchemaFields, SchemaImageFields } from "@/shared/schema/definition";
import {
  getSchemaOptions,
  applySoftDelete,
  applySlugify,
} from "@/shared/schema/fields";

const ProductSchema = new Schema<IProduct>(
  {
    ...SchemaFields,
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      unique: true,
      minlength: [2, "name must be at least 2 characters long"],
      maxlength: [100, "name must be at most 100 characters long"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Product description is required"],
      minlength: [10, "Product description must be at least 10 characters long"],
      maxlength: [1000, "Product description must be at most 1000 characters long"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price must be at least 0"],
    },
    discount: {
      type: Number,
      min: [0, "Discount must be at least 0"],
      max: [100, "Discount cannot be greater than 100"],
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
      required: [true, "Product stock is required"],
      min: [0, "Stock must be at least 0"],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold count cannot be negative"],
    },
    finalPrice: { type: Number, default: 0 },
    colors: [String],
    sku: { type: String, unique: true, sparse: true },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating must be at least 0"],
        max: [5, "Rating must be at most 5"],
        set: (v: number) => Math.round(v * 10) / 10,
      },
      count: { type: Number, default: 0 },
    },
    reviews: [{ type: Types.ObjectId, ref: "Review" }],
    images: {
      type: [
        {
          url: {
            type: String,
            default: "https://ui.shadcn.com/placeholder.svg",
          },
          publicId: { type: String, default: null },
        },
      ],
      validate: {
        validator: function (v: any[]) {
          return v.length <= 5;
        },
        message: "You can upload a maximum of 5 images",
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 10,
        message: "Tags must be at most 10",
      },
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: [
      {
        type: Types.ObjectId,
        ref: "SubCategory",
      },
    ],
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

ProductSchema.virtual("isAvailable").get(function () {
  return this.stock > 0 && this.status === ProductStatusEnum.ACTIVE
    ? "in stock"
    : "out of stock";
});

ProductSchema.methods.hasEnoughStock = function (quantity: number): boolean {
  return this.stock >= quantity;
};

ProductSchema.statics.findActiveProducts = function () {
  return this.find({
    status: ProductStatusEnum.ACTIVE,
    stock: { $gt: 0 },
    deletedAt: null,
  });
};

ProductSchema.pre("save", function () {
  if (this.isModified("price") || this.isModified("discount")) {
    this.finalPrice = this.price - (this.price * (this.discount || 0)) / 100;
  }

  if (!this.sku) {
    const nameParts = this.name
      .split(" ")
      .filter((p) => p.length > 0)
      .map((p) => p.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());

    const brandPart = nameParts[0]?.substring(0, 3) || "PRD";
    const namePart = nameParts[1]?.substring(0, 3) || "";

    const colorPart =
      this.colors && Array.isArray(this.colors) && this.colors.length > 0
        ? String(this.colors[0])
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 3)
            .toUpperCase()
        : "";

    const uniqueSuffix = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    let generatedSku = brandPart;
    if (namePart) generatedSku += `-${namePart}`;
    if (colorPart) generatedSku += `-${colorPart}`;
    generatedSku += `-${uniqueSuffix}`;

    this.sku = generatedSku;
  }
});

// Helper for counting products
ProductSchema.statics.countProductsForModels = async function (
  brandId: any,
  categoryId: any,
  subcategoryIds: any[],
) {
  const brandModel = model("Brand");
  const categoryModel = model("Category");
  const subCategoryModel = model("SubCategory");

  if (brandId) {
    const count = await this.countDocuments({ brand: brandId });
    await brandModel.findByIdAndUpdate(brandId, { products: count });
  }

  if (categoryId) {
    const ids = Array.isArray(categoryId) ? categoryId : [categoryId];
    for (const catId of ids) {
      const count = await this.countDocuments({ category: catId });
      await categoryModel.findByIdAndUpdate(catId, { products: count });
    }
  }

  if (subcategoryIds && subcategoryIds.length > 0) {
    for (const subCatId of subcategoryIds) {
      const count = await this.countDocuments({ subcategory: subCatId });
      await subCategoryModel.findByIdAndUpdate(subCatId, { products: count });
    }
  }
};

ProductSchema.post("save", async function (doc) {
  await (doc.constructor as any).countProductsForModels(
    doc.brand,
    doc.category,
    doc.subcategory,
  );
});

ProductSchema.pre("findOneAndUpdate", async function () {
  (this as any).oldDoc = await this.model.findOne(this.getQuery());
});

ProductSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await (doc.constructor as any).countProductsForModels(
      doc.brand,
      doc.category,
      doc.subcategory,
    );
  }
  const oldDoc = (this as any).oldDoc;
  if (oldDoc) {
    const constructor = doc ? doc.constructor : oldDoc.constructor;
    await (constructor as any).countProductsForModels(
      oldDoc.brand,
      oldDoc.category,
      oldDoc.subcategory,
    );
  }
});

ProductSchema.post("findOneAndDelete", async function (doc: any) {
  if (doc) {
    await (doc.constructor as any).countProductsForModels(
      doc.brand,
      doc.category,
      doc.subcategory,
    );
  }
});

export const productModel = model<IProduct>("Product", ProductSchema);
