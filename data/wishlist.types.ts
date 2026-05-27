export const WISHLIST_STATUS = ["active", "inactive", "completed"] as const;
export type WishlistStatus = (typeof WISHLIST_STATUS)[number];
import { At } from "../core/global.dto";

export type WishlistDto = At & {
  user: string;
  products: string[];
};
