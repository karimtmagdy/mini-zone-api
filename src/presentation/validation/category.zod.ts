import { z } from "zod/v4";
import { imageZod } from "@/shared/schema/shard.schema";
import { CATEGORY_STATUS } from "@/domain/types/category.types";

export const CoreCategoryZod = z
  .object({
    name: z
      .string({ message: "category name is required" })
      .min(3, { message: "category name must be at least 3 characters long" })
      .max(30, {
        message: "category name must be at most 30 characters long",
      }),
    description: z
      .string({ message: "category description is required" })
      .min(10, {
        message: "category description must be at least 10 characters long",
      })
      .max(100, {
        message: "category description must be at most 100 characters long",
      }),
    status: z.enum(CATEGORY_STATUS).default("onboarding"),
    image: imageZod.optional(),
  })
  .strict();

export const createCategoryZod = CoreCategoryZod;

export const updateCategoryZod = CoreCategoryZod.pick({
  name: true,
  description: true,
  status: true,
})
  .refine((data) => data.status, {
    message: "select a valid status",
  })
  .strict();

export type CreateCategoryDTO = z.infer<typeof createCategoryZod>;
export type UpdateCategoryDTO = z.infer<typeof updateCategoryZod>;
