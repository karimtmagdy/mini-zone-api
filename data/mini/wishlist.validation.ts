import { z } from "zod/v4";
import { ObjectIdZod } from "../rules/standard.validation.js";

export const CoreWishList = z.object({
  productId: ObjectIdZod,
});
export const addToWishlistZod = CoreWishList.clone();
export const removeFromWishlistZod = CoreWishList.clone();

export type AddToWishlist = z.infer<typeof addToWishlistZod>;
export type RemoveFromWishlist = z.infer<typeof removeFromWishlistZod>;
