import { CategoryStatus } from "../types/category.types";

export class Category {
  public name!: string;
  public status!: CategoryStatus;
  public description?: string;
  public image?: { url: string; publicId: string };
  public readonly id?: string;
  public slug?: string;
  public products?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  constructor(data: Partial<Category>) {
    Object.assign(this, data);
  }
}
