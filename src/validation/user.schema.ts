import { z } from "zod/v4";
import {
  EmailZod,
  ObjectIdZod,
  PasswordZod,
  regexPhone,
} from "./shard.schema.js";
import { UserRoleEnum } from "../types/user-role.enums.js";

export const PersonBaseZod = z.object({
  username: z.string({
    message: "Username is required and must be a valid string",
  }),
  name: z.object(
    {
      first: z
        .string({
          message: "First name is required and must be a valid string",
        })
        .min(1, "First name cannot be empty")
        .max(50)
        .trim(),
      last: z
        .string({
          message: "Last name is required and must be a valid string",
        })
        .min(1, "Last name cannot be empty")
        .max(50)
        .trim(),
    },
    { message: "Name object is required" },
  ),
  email: EmailZod,
  phone: z
    .string({ message: "Phone must be a valid string" })
    .regex(regexPhone, "Invalid phone number format")
    .optional(),
  gender: z
    .enum(["male", "female"], {
      message: "Gender must be either 'male' or 'female'",
    })
    .optional(),
});
export const registerUserZod = PersonBaseZod.pick({
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
const LoginZod = PersonBaseZod.pick({
  email: true,
}).extend({
  password: PasswordZod,
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
export const createUserZod = PersonBaseZod.pick({
  username: true,
}).extend({
  role: z.nativeEnum(UserRoleEnum, {
    message: "Role is required and must be a valid specified option",
  }),
  password: PasswordZod,
  employee: ObjectIdZod.describe(
    "The ID of the Employee to link this User account to",
  ),
});
export const updateUserZod = createUserZod.partial().omit({ password: true });
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
export type RegisterDTO = z.infer<typeof registerUserZod>;
export type LoginDTO = z.infer<typeof LoginZod>;
export type RefreshTokenDTO = z.infer<typeof RefreshTokenZod>;
export type UpdateUserDTO = z.infer<typeof updateUserZod>;
export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeZod>;
export type SendOTPDTO = z.infer<typeof SendOTPZod>;
export type ForogtPasswordDTO = z.infer<typeof ForogtPasswordZod>;
export type ChangePasswordDTO = z.infer<typeof ChangePasswordZod>;
export type DeactivateUserZod = z.infer<typeof deactivateUserZod>;
export type DeleteUserZod = z.infer<typeof deleteUserZod>;
