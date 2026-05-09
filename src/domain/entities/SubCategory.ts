import { SubCategoryStatus } from "../types/subcategory.types";

export class SubCategory {
  public name!: string;
  public status!: SubCategoryStatus;
  public description?: string;
  public image?: { url: string; publicId: string };
  public readonly id?: string;
  public slug?: string;
  public products?: number;
  public category?: string[];
  public createdAt?: Date;
  public updatedAt?: Date;
  constructor(data: Partial<SubCategory>) {
    Object.assign(this, data);
  }
}
