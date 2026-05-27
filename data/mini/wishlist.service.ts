import { AppError } from "@/middleware/api.error";
import {
  WishlistRepository,
  wishlistRepo,
} from "@/repositories/wishlist.repository";
import { productRepo } from "@/repositories/product.repository";

export class WishlistService {
  constructor(private repo: WishlistRepository) {}

  async addProductToWishlist(userId: string, productId: string) {
    const product = await productRepo.findById(productId);
    if (!product) throw new AppError(404, "Product not found");

    let wishlist = await this.repo.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await this.repo.create({
        user: userId as any,
        products: [productId as any],
      });
    } else {
      // Use addToSet logic or manually check
      const exists = wishlist.products.some(
        (id) => id.toString() === productId
      );
      if (exists) throw new AppError(400, "Product already in wishlist");

      wishlist.products.push(productId as any);
      await wishlist.save();
    }

    return wishlist;
  }

  async getWishlist(userId: string) {
    const wishlist = await this.repo.findOne({ user: userId });
    if (!wishlist) {
      // Return empty or error? Usually empty wishlist is better or create one.
      // Let's create one if not exists or just return empty format.
      return { products: [] };
    }
    return wishlist;
  }

  async removeProductFromWishlist(userId: string, productId: string) {
    const wishlist = await this.repo.findOne({ user: userId });
    if (!wishlist) throw new AppError(404, "Wishlist not found");

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    return wishlist;
  }
}

export const wishlistService = new WishlistService(wishlistRepo);
