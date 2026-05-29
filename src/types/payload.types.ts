import { IUser } from "@/domain/types/user.types";
import { type JwtPayload } from "jsonwebtoken";

export type TokenPayload = Pick<IUser, "id" | "email" | "username" | "role"> &
  JwtPayload;
export type IdPayload = Pick<IUser, "id"> & JwtPayload;

export interface CartPayload {
  cartId: string;
}

export interface ResetPayload extends JwtPayload {
  email: string;
}
