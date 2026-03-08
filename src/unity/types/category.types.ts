export const CATEGORY_STATUS = ["active", "inactive", "archived"] as const;
export type CategoryStatus = (typeof CATEGORY_STATUS)[number];
