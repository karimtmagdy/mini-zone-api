import { z } from "zod/v4";
export const EmailZod = z.email("Invalid email address").toLowerCase().trim();

export const regexPhone: RegExp = /^\+?[\d\s\-()]{7,20}$/;
export const ObjectIdZod = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const PasswordZod = z
  .string()
  .min(6, "password must be at least 6 characters")
  .max(32);
