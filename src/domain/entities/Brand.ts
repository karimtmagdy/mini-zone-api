import { BrandStatus } from "../types/brand.types";

export class Brand {
  public name!: string;
  public status?: BrandStatus;
  public image?: { url: string; publicId: string };
  public readonly id?: string;
  public slug?: string;
  public products?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  constructor(data: Partial<Brand>) {
    Object.assign(this, data);
  }
}
