import { NextFunction, Response } from "express";
import { cartService } from "@/services/cart.service";
import { AuthRequest } from "@/types/user.dto";

export class CartController {
  async addProductToCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.addProductToCart(req.user._id, req.body);
      res.status(200).json({ status: "success", cart });
    } catch (error) {
      next(error);
    }
  }

  async getLoggedUserCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getLoggedUserCart(req.user._id);
      res.status(200).json({ status: "success", cart });
    } catch (error) {
      next(error);
    }
  }

  async removeCartItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.removeCartItem(
        req.user._id,
        req.params.itemId,
      );
      res.status(200).json({ status: "success", cart });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cartService.clearCart(req.user._id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateCartItemQuantity(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const cart = await cartService.updateCartItemQuantity(
        req.user._id,
        req.params.itemId,
        req.body.quantity,
      );
      res.status(200).json({ status: "success", cart });
    } catch (error) {
      next(error);
    }
  }

  async applyCoupon(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.applyCoupon(req.user._id, req.body.coupon);
      res.status(200).json({ status: "success", cart });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
