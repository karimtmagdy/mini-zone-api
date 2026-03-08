export const BRAND_STATUS = ["active", "inactive", "archived"] as const;
export type BrandStatus = (typeof BRAND_STATUS)[number];
