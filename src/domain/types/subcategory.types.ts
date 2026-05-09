export const SUBCATEGORY_STATUS = [
  "active",
  "inactive",
  "archived",
  "trash",
] as const;
export type SubCategoryStatus = (typeof SUBCATEGORY_STATUS)[number];
export enum SubCategoryEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
  TRASH = "trash",
}

export interface ISubCategory {
  name: string;
  slug: string;
  description?: string;
  category: string[];
  products: number;
  status: SubCategoryStatus;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  image: {
    url: string;
    publicId: string;
  };
  id?: string;
}
