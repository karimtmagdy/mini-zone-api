export const SUBCATEGORY_STATUS = ["active", "inactive", "archived"] as const;
export type SubCategoryStatus = (typeof SUBCATEGORY_STATUS)[number];
