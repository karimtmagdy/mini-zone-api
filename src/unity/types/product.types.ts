export const PRODUCT_STATUS = [
  "active",
  "inactive",
  "draft",
  "archived",
] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];

export type ProductStockStatus = "in-stock" | "out-of-stock";
export type ProductType = "physical" | "digital";
