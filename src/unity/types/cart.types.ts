export const CART_STATUS = ["active", "inactive", "completed"] as const;
export type CartStatus = (typeof CART_STATUS)[number];

