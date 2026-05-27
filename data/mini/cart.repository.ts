import { Cart } from "@/models/cart.model";
import { ICart } from "@/types/cart.dto";

export class CartRepository {
  async findOne(filter: Record<string, any>) {
    return await Cart.findOne(filter).populate(
      "cartItems.product",
      "name price cover description"
    );
  }

  async create(data: Partial<ICart>) {
    return await Cart.create(data);
  }

  async update(id: string, data: Record<string, any>) {
    return await Cart.findByIdAndUpdate(id, data, { new: true }).populate(
      "cartItems.product",
      "name price cover description"
    );
  }

  async delete(id: string) {
    return await Cart.findByIdAndDelete(id);
  }

  async deleteByUserId(userId: string) {
    return await Cart.findOneAndDelete({ user: userId });
  }
}

export const cartRepo = new CartRepository();
