import { Types } from "mongoose";
import { ProductStatus } from "../types/product.types";

export class Product {
  public name!: string;
  public status!: ProductStatus;
  public description?: string;
  public images?: { url: string; publicId: string }[];
  public readonly id?: string;
  public price!: number;
  public sku!: string;
  public stock!: number;
  public quantity?: number;
  public discount!: number;
  public sold!: number;
  public colors?: string[];
  public subcategory!: (string | Types.ObjectId)[];
  public category!: (string | Types.ObjectId)[];
  public brand!: string | Types.ObjectId;
  public slug?: string;
  public ratings?: {
    average: number;
    count: number;
  };
  public reviews?: (string | Types.ObjectId)[];
  public tags?: string[];
  public finalPrice!: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  constructor(data: Partial<Product>) {
    Object.assign(this, data);
  }
}
