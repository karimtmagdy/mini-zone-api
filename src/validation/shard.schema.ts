import { z } from "zod/v4";
export const EmailZod = z.string({
  message: "Email is required and must be a valid string",
}).email("Invalid email address").toLowerCase().trim();

export const regexPhone: RegExp = /^\+?[\d\s\-()]{7,20}$/;
export const ObjectIdZod = z
  .string({
    message: "ID is required and must be a valid string",
  })
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId format");

export const PasswordZod = z
  .string({
    message: "Password is required and must be a valid string",
  })
  .min(6, "password must be at least 6 characters")
  .max(32, "password must be at most 32 characters");

export const IdParamZod = z.object({
  id: ObjectIdZod,
});

export const MultipleBulkDeleteZod = z.object({
  ids: z.array(ObjectIdZod).min(1),
});
