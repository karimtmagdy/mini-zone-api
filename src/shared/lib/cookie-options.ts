import { type CookieOptions as ExpressCookieOptions } from "express";
import { enviro } from "@/shared/lib/local.env";

export const BaseCookieOptions: ExpressCookieOptions = {
  httpOnly: true,
  secure: enviro.nodeEnv === "production",
  sameSite: enviro.nodeEnv === "production" ? "none" : "lax", // 'none' requires 'secure: true'
  path: "/",
};

export const CookieOptions: ExpressCookieOptions = {
  ...BaseCookieOptions,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};
