import { Document } from "mongoose";
import type { Router } from "express";
export interface IBaseDate extends Document {
  createdAt: Date;
  updatedAt: Date;
}
export type Image = {
  url: string;
  publicId: string | null;
};
export const DEFAULT_USER_IMAGE =
  "https://www.vecteezy.com/png/24983914-simple-user-default-icon";

// export interface GlobalResponse<T> {
//   status: string;
//   message?: string;
//   data: T;
// }
export type Route = {
  path: string;
  router: Router;
};
