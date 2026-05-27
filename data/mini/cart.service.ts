import { AppError } from "@/middleware/api.error";
import { CartRepository, cartRepo } from "@/repositories/cart.repository";
import { productRepo } from "@/repositories/product.repository";
import { couponRepo } from "@/repositories/coupon.repository";
import { ICart, ICartItem } from "@/types/cart.dto";

export class CartService {
  constructor(private repo: CartRepository) {}

  async addProductToCart(
    userId: string,
    data: { productId: string; color?: string; quantity?: number }
  ) {
    const { productId, color, quantity = 1 } = data;
    const product = await productRepo.findById(productId);
    if (!product) throw new AppError(404, "Product not found");

    let cart = await this.repo.findOne({ user: userId });

    if (!cart) {
      cart = await this.repo.create({
        user: userId as any,
        cartItems: [
          {
            product: productId as any,
            price: product.price,
            color,
            quantity,
          },
        ],
      });
    } else {
      const itemIndex = cart.cartItems.findIndex(
        (item) =>
          item.product._id.toString() === productId && item.color === color
      );

      if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity += quantity;
      } else {
        cart.cartItems.push({
          product: productId as any,
          price: product.price,
          color,
          quantity,
        });
      }
    }

    this.calcTotalCartPrice(cart);
    return await cart.save();
  }

  async getLoggedUserCart(userId: string) {
    const cart = await this.repo.findOne({ user: userId });
    if (!cart) throw new AppError(404, "Cart not found for this user");
    return cart;
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.repo.findOne({ user: userId });
    if (!cart) throw new AppError(404, "Cart not found");

    cart.cartItems = cart.cartItems.filter(
      (item: ICartItem) => item._id?.toString() !== itemId
    );

    this.calcTotalCartPrice(cart);
    return await cart.save();
  }

  async clearCart(userId: string) {
    await this.repo.deleteByUserId(userId);
  }

  async updateCartItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
  ) {
    const cart = await this.repo.findOne({ user: userId });
    if (!cart) throw new AppError(404, "Cart not found");

    const itemIndex = cart.cartItems.findIndex(
      (item: ICartItem) => item._id?.toString() === itemId
    );
    if (itemIndex === -1) throw new AppError(404, "Item not found in cart");

    cart.cartItems[itemIndex].quantity = quantity;

    this.calcTotalCartPrice(cart);
    return await cart.save();
  }

  async applyCoupon(userId: string, couponName: string) {
    const coupon = await couponRepo.findOne({
      name: couponName,
      expiry: { $gt: Date.now() },
      isActive: true,
    });
    if (!coupon) throw new AppError(400, "Coupon is invalid or has expired");

    const cart = await this.repo.findOne({ user: userId });
    if (!cart) throw new AppError(404, "Cart not found");

    cart.coupon = couponName;
    cart.totalPriceAfterDiscount = Number(
      (
        cart.totalCartPrice -
        (cart.totalCartPrice * coupon.discount) / 100
      ).toFixed(2)
    );

    return await cart.save();
  }

  private calcTotalCartPrice(cart: ICart) {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined; // Reset discount if cart changes
    cart.coupon = undefined;
  }
}

export const cartService = new CartService(cartRepo);
