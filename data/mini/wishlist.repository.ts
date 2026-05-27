import { Wishlist } from "@/models/wishlist.model";
import { IWishlist } from "@/types/wishlist.dto";

export class WishlistRepository {
  async findOne(filter: Record<string, any>) {
    return await Wishlist.findOne(filter).populate(
      "products",
      "name price cover description ratings_average"
    );
  }

  async create(data: Partial<IWishlist>) {
    return await Wishlist.create(data);
  }

  async update(id: string, data: Record<string, any>) {
    return await Wishlist.findByIdAndUpdate(id, data, { new: true }).populate(
      "products",
      "name price cover description ratings_average"
    );
  }

  async deleteByUserId(userId: string) {
    return await Wishlist.findOneAndDelete({ user: userId });
  }
}

export const wishlistRepo = new WishlistRepository();
