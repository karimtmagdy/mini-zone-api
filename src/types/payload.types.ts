 import { type JwtPayload } from "jsonwebtoken";
import { IUser } from "@/domain/types/person.types";

export type TokenPayload = Pick<IUser, "id" | "email" | "username" | "role"> &
  JwtPayload;
export type IdPayload = Pick<IUser, "id"> & JwtPayload;

export interface CartPayload {
  cartId: string;
}

export interface ResetPayload extends JwtPayload {
  email: string;
}
