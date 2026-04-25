import { type JwtPayload } from "jsonwebtoken";
interface IUser {
  id: string;
  email: string;
  username: string;
  role: string;
}
export type TokenPayload = Pick<IUser, "id" | "email" | "username" | "role"> &
  JwtPayload;
export type IdPayload = Pick<IUser, "id"> & JwtPayload;

export interface CartPayload {
  cartId: string;
}
// export interface ResetPayload extends JWTPayload {
//   email: string;
// }
