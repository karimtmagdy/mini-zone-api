import { z } from "zod/v4";

export const registerZod = z
  .object({
    username: z
      .string()
      .min(3, { message: "username must be at least 3 characters" })
      .max(50, { message: "username must be less than 50 characters" })
      .trim(),
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: z
      .string({ message: "password is required" })
      .min(6, "password must be at least 6 characters")
      .max(30, "password must be less than 30 characters")
      .describe("enter your password"),
  })
  .extend({
    confirm: z
      .string({ message: "password is required" })
      .min(6, "password must be at least 6 characters")
      .max(30, "password must be less than 30 characters")
      .describe("confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "passwords do not match",
    path: ["confirm"],
  });

export const loginZod = z
  .object({
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: z
      .string({ message: "password is required" })
      .min(6, "password must be at least 6 characters")
      .max(30, "password must be less than 30 characters")
      .describe("enter your password"),
  })
  .required();

export const changePassword = z
  .object({
    current: z
      .string({ message: "password is required" })
      .min(6, "password must be at least 6 characters")
      .max(30, "password must be less than 30 characters")
      .describe("enter your current password"),
    newPassword: z
      .string({ message: "password is required" })
      .min(6, "password must be at least 6 characters")
      .max(30, "password must be less than 30 characters")
      .describe("enter your new password"),
    confirm: z
      .string({ message: "password is required" })
      .min(6, "password must be at least 6 characters")
      .max(30, "password must be less than 30 characters")
      .describe("confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirm, {
    error: "passwords do not match",
    path: ["confirm"],
  })
  .required();

export const forgotPassword = z
  .object({ email: z.email("Invalid email address").trim().toLowerCase() })
  .strict()
  .required();
export const resetPassword = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
});
export const OTP = z
  .object({
    code: z.string().length(6, "OTP code must be 6 digits"),
  })
  .required();
export const verify2FA = z.object({
  token: z.string().length(6, "Token must be 6 digits"),
});
export const loginWith2FA = z.object({
  loginToken: z.string(),
  token2FA: z.string().length(6, "Token must be 6 digits"),
});
export const deleteAccount = z
  .object({
    password: z
      .string({ message: "password is required" })
      .min(6, "password must be at least 6 characters")
      .max(30, "password must be less than 30 characters")
      .describe("enter your password"),
  })
  .required();
export const deactivateAccount = z
  .object({
    password: z
      .string({ message: "password is required" })
      .min(6, "password must be at least 6 characters")
      .max(30, "password must be less than 30 characters")
      .describe("enter your password"),
  })
  .required();

export const updateAccount = z.object({});

// export const resetPassword = PersonBase.pick({
//   email: true,
//   password: true,
// }).extend({
//   confirm: z
//     .string({ message: "password is required" })
//     .min(6, "password must be at least 6 characters")
//     .max(30, "password must be less than 30 characters")
//     .describe("confirm your password"),
// });

export type TRegisterEX = z.infer<typeof registerZod>;
export type TLoginEX = z.infer<typeof loginZod>;
export type TChangePasswordEX = z.infer<typeof changePassword>;
export type TForgotPasswordEX = z.infer<typeof forgotPassword>;
export type TResetPasswordEX = z.infer<typeof resetPassword>;
export type TOtpEX = z.infer<typeof OTP>;
export type TVerify2FaEX = z.infer<typeof verify2FA>;
export type TLogin2FaEX = z.infer<typeof loginWith2FA>;
export type TUpdateAccountEX = z.infer<typeof updateAccount>;
export type TDeleteAccountEX = z.infer<typeof deleteAccount>;
export type TDeactivateAccountEX = z.infer<typeof deactivateAccount>;
// export const resetPassword  = register .extend({ params: z.object({ token: z.string() }) });
