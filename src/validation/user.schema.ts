import { z } from "zod/v4";
import {
  EmailZod,
  ObjectIdZod,
  PasswordZod,
  regexPhone,
} from "./shard.schema.js";

const PersonBaseZod = z.object({
  username: z.string(),
  name: z.object({
    first: z.string().min(1).max(50).trim(),
    last: z.string().min(1).max(50).trim(),
  }),
  email: EmailZod,
  phone: z.string().regex(regexPhone).optional(),
  gender: z.enum(["male", "female"]).optional(),
});
const registerZod = PersonBaseZod.pick({
  username: true,
  email: true,
})
  .extend({
    password: PasswordZod,
    confirm: PasswordZod.describe("confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    error: "passwords do not match",
    path: ["confirm"],
  });
const LoginZod = registerZod.omit({
  username: true,
  confirm: true,
});
const ChangePasswordZod = z
  .object({
    current: PasswordZod.describe(""),
    new: PasswordZod.describe("enter your new password"),
    confirm: PasswordZod.describe("confirm your new password"),
  })
  .refine((data) => data.new === data.confirm, {
    error: "passwords do not match",
    path: ["confirm"],
  })
  .required();
const RefreshTokenZod = z.object({
  refreshToken: z.string().min(1),
});
const ForogtPasswordZod = PersonBaseZod.pick({ email: true })
  .strict()
  .required();
const SendOTPZod = z.object({
  code: z.string().length(6, "OTP code must be 6 digits"),
});
const createUserZod = PersonBaseZod.pick({
  name: true,
  email: true,
  phone: true,
}).extend({
  role: z.enum([]),
  password: PasswordZod,
  employeeId: ObjectIdZod.optional(),
});
const UpdateUserZod = createUserZod.partial().omit({ password: true });
const CreateEmployeeZod = PersonBaseZod.pick({
  name: true,
  email: true,
  phone: true,
});
const deleteUserZod = z.object({
  password: z.string("password is required to confirm deletion"),
});
const deactivateUserZod = z.object({
  password: z.string("Password is required to confirm deactivation"),
});
export type RegisterDTO = z.infer<typeof registerZod>;
export type LoginDTO = z.infer<typeof LoginZod>;
export type RefreshTokenDTO = z.infer<typeof RefreshTokenZod>;
export type UpdateUserDTO = z.infer<typeof UpdateUserZod>;
export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeZod>;
export type SendOTPDTO = z.infer<typeof SendOTPZod>;
export type ForogtPasswordDTO = z.infer<typeof ForogtPasswordZod>;
export type ChangePasswordDTO = z.infer<typeof ChangePasswordZod>;
export type DeactivateUserZod = z.infer<typeof deactivateUserZod>;
export type DeleteUserZod = z.infer<typeof deleteUserZod>;
