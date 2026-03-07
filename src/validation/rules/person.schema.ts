import { z } from "zod/v4";
import { EmailZod, phoneZod, slugy } from "./shard.schema.js";
import {
  USER_GENDERS,
  USER_STATE,
  USER_STATUS,
} from "../../unity/types/user.types.js";
import {
  UserRoleEnum,
  UserStateEnum,
  UserStatusEnum,
} from "../../unity/enums/user-enums.js";

/**
 * Core personal information shared by all "Person" entities.
 */
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
      { message: "Name object is required" },
    )
    .transform((name) => ({
      ...name,
    })),
  email: EmailZod,
  phone: phoneZod.optional(),
  gender: z.enum(USER_GENDERS).optional(),
  age: z
    .number()
    .positive()
    .min(18, { message: "Age must be at least 18" })
    .optional(),
  image: z
    .object({
      url: z.string(),
      publicId: z.string().nullable(),
    })
    .optional(),
});

/**
 * Shared account/system state for all "Person" entities.
 */
export const SharedAccountZod = z.object({
  status: z.enum(USER_STATUS).default(UserStatusEnum.ACTIVE),
  state: z.enum(USER_STATE).default(UserStateEnum.OFFLINE).readonly(),
  role: z
    .nativeEnum(UserRoleEnum, {
      message: "Role is required and must be a valid specified option",
    })
    .optional(),
  slug: slugy.optional(),
  lastLoginAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),
});

/**
 * Combined base for a Person (Generic).
 */
export const PersonBaseZod = CorePersonZod.merge(SharedAccountZod);
