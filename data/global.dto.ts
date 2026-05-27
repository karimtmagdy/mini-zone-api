import type { Router } from "express";
import { ImageDto } from "../../rules/standard.validation.js";

export const DEFAULT_USER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export type Route = {
  path: string;
  router: Router;
};
export interface StandardTypes {
  image: ImageDto;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
