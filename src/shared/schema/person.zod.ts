import { z } from "zod/v4";
import { EmailZod, ObjectIdZod, PasswordZod, phoneZod } from "@/shared/schema/shard.schema";
import {
  PERSON_GENDERS,
  PERSON_STATE,
  PERSON_STATUS,
  PERSON_ROLES,
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_JOB_TITLES,
} from "@/domain/types/person.types";
import { queryZod } from "./query.schema";
 
export const CorePersonZod = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" })
    .transform((u) => u.trim())
    .optional(),
  name: z
    .object(
      {
        first: z
          .string({ message: "First name is required" })
          .min(1, { message: "First name cannot be empty" })
          .max(50, {
            message: "First name cannot be longer than 50 characters",
          })
          .trim(),
        last: z
          .string({ message: "Last name is required" })
          .min(1, { message: "Last name cannot be empty" })
          .max(50, { message: "Last name cannot be longer than 50 characters" })
          .trim(),
      },
      {
        message:
          'Name must be an object with "first" and "last" fields. Example: { "first": "John", "last": "Doe" }',
      },
    )
    .transform((name) => ({
      ...name,
    })),
  email: EmailZod,
  password: PasswordZod,
  phone: phoneZod.optional(),
  gender: z.enum(PERSON_GENDERS).optional(),
  age: z
    .number()
    .positive()
    .min(18, { message: "Age must be at least 18" })
    .optional(),
  image: z
    .object({
      url: z.string(),
      publicId: z.string(),
    })
    .optional(),
});

/**
 * Shared account/system state for all "Person" entities.
 */
export const SharedAccountZod = z.object({
  status: z.enum(PERSON_STATUS).default("active"),
  state: z.enum(PERSON_STATE).default("offline").readonly(),
  role: z
    .enum(PERSON_ROLES, {
      message: "Role is required and must be a valid specified option",
    })
    .optional(),
  slug: z.any(),
  lastLoginAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),
   cart: z
    .array(z.object({ type: z.string(), productId: z.string() }))
    .default([]),
});

export const PersonBaseZod = CorePersonZod.merge(SharedAccountZod);
export const createEmployeeZod = PersonBaseZod.extend({
  username: z.string().min(3).max(50),
  code: z.string().optional(),
  department: z.enum(EMPLOYEE_DEPARTMENTS),
  jobTitle: z.enum(EMPLOYEE_JOB_TITLES),
  salary: z.number().positive().optional(),
  hiredAt: z.coerce.date().optional(),
  managerId: ObjectIdZod.optional(),
  password: z.string().min(6).optional(),
});

export const updateEmployeeZod = createEmployeeZod.partial().omit({
  code: true,
  hiredAt: true,
  password: true,
});

export const employeeQueryZod = queryZod.extend({
  department: z.enum(EMPLOYEE_DEPARTMENTS).optional(),
  managerId: ObjectIdZod.optional(),
  status: z.string().optional(),
  jobTitle: z.string().optional(),
});

export type CreateEmployeeDTO = z.infer<typeof createEmployeeZod>;
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeZod>;

export const createUserZod = PersonBaseZod.extend({
  username: z.string().min(3).max(50),
  password: PasswordZod,
  employeeId: ObjectIdZod.optional(),
});

export const updateUserZod = createUserZod.partial().omit({
  password: true,
  employeeId: true,
});

export const userQueryZod = queryZod.extend({
  employeeId: ObjectIdZod.optional(),
  status: z.string().optional(),
  role: z.string().optional(),
});

export const changeRoleZod = PersonBaseZod.pick({ role: true }).required();
// AssignRoleZod
export const deleteUserZod = z.object({
  password: PasswordZod.describe("Password is required to confirm deletion"),
});

export const deactivateUserZod = z.object({
  password: PasswordZod.describe(
    "Password is required to confirm deactivation",
  ),
});
export type CreateUserDTO = z.infer<typeof createUserZod>;
export type UpdateUserDTO = z.infer<typeof updateUserZod>;
export type ChangeRoleDTO = z.infer<typeof changeRoleZod>;
export type DeleteUserDTO = z.infer<typeof deleteUserZod>;
export type DeactivateUserDTO = z.infer<typeof deactivateUserZod>;
export type UserQueryDTO = z.infer<typeof userQueryZod>;

export const updateStatusZod = PersonBaseZod.pick({ status: true }).required();
export const bulkIdsZod = z.object({
  ids: z.array(ObjectIdZod).min(1, "At least one ID is required"),
});

// export const createUserZod = PersonBaseZod.pick({
//   username: true,
//   role: true,
// }).extend({
//   password: PasswordZod,
//   employee: ObjectIdZod.describe(
//     "The ID of the Employee to link this User account to",
//   ),
// });

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
}).extend({
    remember: z.boolean().default(false).optional(),
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
// export const refreshTokenZod = z.object({
//   cookies: z.object({
//     refreshToken: z.string({
//       message: "Refresh token is missing",
//     }),
//   }),
// });
export const forgotPasswordZod = PersonBaseZod.pick({ email: true })
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
export const updateProfileZod = PersonBaseZod.partial().pick({
  name: true,
  phone: true,
  gender: true,
  age: true,
  image: true,
});

export type UpdateUserProfile = z.infer<typeof updateProfileZod>;

const deactivateProfileZod = z.object({
  password: z.string({
    message: "Password is required to confirm deactivation",
  }),
});
  type DeactivateProfile = z.infer<typeof deactivateProfileZod>;
