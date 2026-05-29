import { ImageDto } from "@/shared/schema/shard.schema";
import type { Router } from "express";

export const DEFAULT_USER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export type Route = {
  path: string;
  router: Router;
};

export interface PaginationMeta {
  total: number;
  results: number;
  limit: number;
  pages: number;
  page: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
export interface IBaseMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  deletedAt: Date;
  deletedBy: string;
}
export interface IBaseImage {
  image: {
    url: string;
    publicId: string;
  };
}
export interface IBaseImageArray extends IBaseMetadata {
  images: {
    image: IBaseImage;
  }[];
}
// export type IPerson = {

//

// verifyOtp?: {
//   code: string;
//   expiresAt: Date;
// } | null;
// resetOtp?: {
//   code: string;
//   expiresAt: Date;
// } | null;

// twoFactorSecret?: string;
// comparePassword(candidatePassword: string): Promise<boolean>;

// };
