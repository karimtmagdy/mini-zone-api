import { z } from "zod/v4";
import { PersonBaseZod } from "@/shared/schema/person.zod";
import { EmailZod, PasswordZod } from "@/shared/schema/shard.schema";

export const registerUserZod = PersonBaseZod.pick({
  email: true,
  username: true,
  password: true,
})
  .extend({
    confirm: PasswordZod.describe("Confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const LoginZod = PersonBaseZod.pick({
  email: true,
  password: true,
});

export type RegisterDTO = z.infer<typeof registerUserZod>;
export type LoginDTO = z.infer<typeof LoginZod>;

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
