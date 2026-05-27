import { model, Schema, Types } from "mongoose";

import { ProductDto } from "../contract/product.dto";
import { Category } from "./category.model";
import { Brand } from "./brand.model";
import { SubCategory } from "./subcategory.model";

const ProductSchema = new Schema<ProductDto>({
  deletedAt: { type: Date, default: null },
});

// Unified Aggregation logic for Category, Brand, and SubCategory productsCount
ProductSchema.statics.countProductsForModels = async function (
  ids: Types.ObjectId[],
  field: "category" | "brand" | "subcategory",
  Model: any,
) {
  if (!ids || ids.length === 0) return;

  const stats = await this.aggregate([
    {
      $match: {
        [field]: { $in: ids },
        deletedAt: null,
        status: "active",
      },
    },
    { $unwind: `$${field}` },
    { $match: { [field]: { $in: ids } } },
    { $group: { _id: `$${field}`, nProduct: { $sum: 1 } } },
  ]);

  const statsMap = new Map(
    stats.map((s: any) => [s._id.toString(), s.nProduct]),
  );

  for (const id of ids) {
    const count = statsMap.get(id.toString()) || 0;
    await Model.findByIdAndUpdate(id, { productsCount: count });
  }
};

ProductSchema.post("save", async function () {
  const ProductModel = this.constructor as any;
  if (this.category?.length > 0) {
    await ProductModel.countProductsForModels(
      this.category,
      "category",
      Category,
    );
  }
  if (this.brand) {
    await ProductModel.countProductsForModels([this.brand], "brand", Brand);
  }
  if (this.subcategory?.length > 0) {
    await ProductModel.countProductsForModels(
      this.subcategory,
      "subcategory",
      SubCategory,
    );
  }
});

ProductSchema.pre("findOneAndUpdate", async function () {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    (this as any)._oldValues = {
      category: docToUpdate.category,
      brand: docToUpdate.brand,
      subcategory: docToUpdate.subcategory,
    };
  }
});

ProductSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  const ProductModel = this.model as any;
  const oldValues = (this as any)._oldValues || {};

  const updateStats = async (
    field: "category" | "brand" | "subcategory",
    Model: any,
  ) => {
    const oldVal = oldValues[field]
      ? Array.isArray(oldValues[field])
        ? oldValues[field]
        : [oldValues[field]]
      : [];
    const newVal = doc[field]
      ? Array.isArray(doc[field])
        ? doc[field]
        : [doc[field]]
      : [];

    const allIds = [
      ...new Set([
        ...oldVal.map((id: any) => id.toString()),
        ...newVal.map((id: any) => id.toString()),
      ]),
    ]
      .filter(Boolean)
      .map((id) => new Types.ObjectId(id));

    if (allIds.length > 0) {
      await ProductModel.countProductsForModels(allIds, field, Model);
    }
  };

  await updateStats("category", Category);
  await updateStats("brand", Brand);
  await updateStats("subcategory", SubCategory);
});

ProductSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const ProductModel = doc.constructor as any;
  if (doc.category?.length > 0) {
    await ProductModel.countProductsForModels(
      doc.category,
      "category",
      Category,
    );
  }
  if (doc.brand) {
    await ProductModel.countProductsForModels([doc.brand], "brand", Brand);
  }
  if (doc.subcategory?.length > 0) {
    await ProductModel.countProductsForModels(
      doc.subcategory,
      "subcategory",
      SubCategory,
    );
  }
});

export const Product = model<ProductDto>("Product", ProductSchema);
