import { NextFunction, Response } from "express";
import { wishlistService } from "@/services/wishlist.service";
import { AuthRequest } from "@/types/user.dto";

export class WishlistController {
  async addProductToWishlist(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const wishlist = await wishlistService.addProductToWishlist(
        req.user._id,
        req.body.productId
      );
      res.status(200).json({ status: "success", data: wishlist });
    } catch (error) {
      next(error);
    }
  }

  async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.getWishlist(req.user._id);
      res.status(200).json({ status: "success", data: wishlist });
    } catch (error) {
      next(error);
    }
  }

  async removeProductFromWishlist(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const wishlist = await wishlistService.removeProductFromWishlist(
        req.user._id,
        req.params.productId
      );
      res.status(200).json({ status: "success", data: wishlist });
    } catch (error) {
      next(error);
    }
  }
}

export const wishlistController = new WishlistController();
