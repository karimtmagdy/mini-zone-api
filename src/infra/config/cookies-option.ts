import { CookieOptions } from "express";
import { SESSION_TTL_MS } from "@/domain/types/session.types";

/** httpOnly cookie holding the opaque server-side session id. */
export const SID_COOKIE = "sid";
export const COOKIE_MAX_AGE_MS = SESSION_TTL_MS;
const production = process.env.NODE_ENV === "production";

export const BaseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: production,
  // 'none' requires 'secure: true' "none" : "lax"
  sameSite: production ? "none" : "strict",
};
export const cookieOptions: CookieOptions = {
  ...BaseCookieOptions,
  maxAge: COOKIE_MAX_AGE_MS,
};
