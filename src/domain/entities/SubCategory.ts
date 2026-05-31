import { SubCategoryStatus } from "../types/subcategory.types";

export class SubCategory {
  public name!: string;
  public description?: string;
  public status!: SubCategoryStatus;
  public image?: { url: string; publicId: string };
  public category?: { id: string; name: string }[];
  public readonly id?: string;
  public slug?: string;
  public products?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  constructor(data: Partial<SubCategory>) {
    Object.assign(this, data);
  }
}
