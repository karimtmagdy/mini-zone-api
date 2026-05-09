export const CATEGORY_STATUS = ["active", "inactive", "archived"] as const;

export type CategoryStatus = (typeof CATEGORY_STATUS)[number];

export enum CategoryStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}
export interface ICategory {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  products: number;
  image: {
    url: string;
    publicId: string;
  };
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
