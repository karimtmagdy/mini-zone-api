import { z } from "zod/v4";
import { EmailZod, PasswordZod, phoneZod, slugy } from "@/shared/schema/shard.schema";
import {
  PERSON_GENDERS,
  PERSON_STATE,
  PERSON_STATUS,
  PErsonStateEnum,
  PersonStatusEnum,
} from "@/domain/types/person.types";
import { UserRoleEnum } from "@/domain/types/user.types";

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
  status: z.enum(PERSON_STATUS).default(PersonStatusEnum.ACTIVE),
  state: z.enum(PERSON_STATE).default(PErsonStateEnum.OFFLINE).readonly(),
  role: z
    .nativeEnum(UserRoleEnum, {
      message: "Role is required and must be a valid specified option",
    })
    .optional(),
  slug: slugy.optional(),
  lastLoginAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),
});

export const PersonBaseZod = CorePersonZod.merge(SharedAccountZod);
