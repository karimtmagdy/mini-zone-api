import { z } from "zod/v4";
import { CATEGORY_STATUS } from "../unity/types/category.types.js";
import { imageZod } from "./rules/shard.schema.js";
import { CategoryStatusEnum } from "../unity/enums/category.enums.js";

export const CoreCategoryZod = z
  .object({
    name: z
      .string({ message: "Category name is required" })
      .min(3, { message: "Category name must be at least 3 characters long" })
      .max(30, {
        message: "Category name must be at most 30 characters long",
      }),
    description: z
      .string({ message: "Category description is required" })
      .min(10, {
        message: "Category description must be at least 10 characters long",
      })
      .max(100, {
        message: "Category description must be at most 100 characters long",
      }),
    status: z.enum(CATEGORY_STATUS).default(CategoryStatusEnum.ACTIVE),
    image: imageZod,
  })
  .strict();

export const createCategoryZod = CoreCategoryZod;

export const updateCategoryZod = CoreCategoryZod
  .pick({
    name: true,
    description: true,
    status: true,
  })
  .refine((data) => data.status, {
    message: "select a valid status",
  })
  .strict();

export type CreateCategory = z.infer<typeof createCategoryZod>;
export type UpdateCategory = z.infer<typeof updateCategoryZod>;
