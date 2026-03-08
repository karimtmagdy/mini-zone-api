export const WISHLIST_STATUS = ["active", "inactive", "completed"] as const;
export type WishlistStatus = (typeof WISHLIST_STATUS)[number];
