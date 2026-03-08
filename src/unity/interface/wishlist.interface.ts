import { At } from "../core/global.dto";

export type WishlistDto = At & {
  user: string;
  products: string[];
};
