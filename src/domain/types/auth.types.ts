import { LoginDTO, RegisterDTO } from "@/presentation/validation/auth.zod";

export const BRAND_STATUS = ["active", "inactive", "archived"] as const;

export type BrandStatus = (typeof BRAND_STATUS)[number];

export enum BrandStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ARCHIVED = "archived",
}

export interface AuthRepoType {
  register(): Promise<RegisterDTO>;
  login(): Promise<LoginDTO>;
  logout(): Promise<any>;
  refresh(): Promise<any>;
  revoked(): Promise<any>;
  logoutAll(): Promise<any>;
  changePassword(): Promise<any>;
  resetPassword(): Promise<any>;
  forgotPassword(): Promise<any>;
}
