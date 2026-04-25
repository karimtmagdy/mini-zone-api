import { z } from "zod/v4";
import { EmailZod, PasswordZod } from "@/validation/rules/shard.schema";
import { PersonBaseZod } from "@/validation/rules/person.schema";

const registerBase = PersonBaseZod.pick({
  email: true,
}).extend({
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" })
    .transform((username) => username.trim()),
  password: PasswordZod,
});

export const registerUserZod = registerBase
  .extend({
    confirm: PasswordZod.describe("Confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const LoginZod = registerBase.pick({
  email: true,
  password: true,
});

export const changePasswordZod = z
  .object({
    current: PasswordZod.describe("Enter your current password"),
    new: PasswordZod.describe("Enter your new password"),
    confirm: PasswordZod.describe("Confirm your new password"),
  })
  .refine((data) => data.new === data.confirm, {
    error: "Passwords do not match",
    path: ["confirm"],
  })
  .required();

export const refreshTokenZod = z.object({
  refreshToken: z.string({ message: "Refresh token is missing" }).min(1, {
    message: "Refresh token cannot be empty",
  }),
});

export const forogtPasswordZod = PersonBaseZod.pick({ email: true })
  .strict()
  .required();

export const OTPZod = z
  .object({
    code: z.string().length(6, "OTP code must be 6 digits"),
  })
  .required();

export const verify2FAZod = z.object({
  token: z.string().length(6, "Token must be 6 digits"),
});

export const loginWith2FAZod = z.object({
  loginToken: z.string(),
  token2FA: z.string().length(6, "Token must be 6 digits"),
});

export const resetPasswordZod = z
  .object({
    email: EmailZod,
    otp: z.string().length(6, "OTP code must be 6 digits").optional(),
    password: PasswordZod,
    confirm: PasswordZod.describe("Confirm your new password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })
  .required();
