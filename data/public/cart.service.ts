import { Request, Response } from "express";
import { ICart, ICartItem } from "../types/CartType";
import { Cart } from "../models/Cart";
import { ExtendedRequest } from "../types/UserType";
import { fn } from "../lib/utils";

export const createCart = fn(async (req: Request, res: Response) => {
  const { userId }: ICart = req.body;
  const cart = await Cart.create({ userId, totalAmount: 0 });
  await cart.save();
  res.status(201).json({ cart, message: "cart has been created" });
});
export const getActiveCart = fn(async (req: ExtendedRequest, res: Response) => {
  const userId = req.user?._id;
  const cart = await Cart.findOne({
    userId: userId,
    status: "active",
  }); //.populate("items.productId");
  if (!cart) await Cart.create({ userId });
  // if (!cart) await createCart({ userId });
  return res.status(200).json({ cart });
});

export const addItemToCart = fn(async (req: ExtendedRequest, res: Response) => {
  // const { userId }: ICart = req.body;
  // const cart = await Cart.findOne({ userId });
  const userId = req.user?._id;
  const { productId, quantity, color, unitPrice }: ICartItem = req.body;
  const cart = await Cart.findOne({ userId, status: "active" });
  if (!cart) await Cart.create({ userId });
  const existingItem = cart.items.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, color, unitPrice });
  }
  await cart.save();
  return res.json({ cart, message: "add item to cart successfully" });
});
