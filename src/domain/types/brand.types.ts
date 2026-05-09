export const BRAND_STATUS = [
  "active",
  "inactive",
  "archived",
  "trash",
] as const;

export type BrandStatus = (typeof BRAND_STATUS)[number];

export enum BrandStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
  TRASH = "trash",
}
export interface IBrand {
  id: string;
  name: string;
  status: BrandStatus;
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
