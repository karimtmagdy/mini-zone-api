import { z } from "zod";
import {
  SUBCATEGORY_STATUS,
  SubCategoryEnum,
} from "@/domain/types/subcategory.types";

const CoreSubCategory = z.object({
  name: z
    .string({ message: "sub category name is required" })
    .min(2, { message: "name must be at least 2 characters" })
    .max(32, { message: "name must be at most 32 characters" }),
  description: z
    .string()
    .min(10, { message: "description must be at least 10 characters" })
    .max(500, { message: "description must be at most 500 characters" })
    .optional(),
  category: z.array(z.string()).min(1, "At least one category is required"),
  status: z.enum(SUBCATEGORY_STATUS).default(SubCategoryEnum.ACTIVE),
});

export const createSubCategoryZod = CoreSubCategory;
export const updateSubCategoryZod = CoreSubCategory.partial();

export type CreateSubCategoryZod = z.infer<typeof createSubCategoryZod>;
export type UpdateSubCategoryZod = z.infer<typeof updateSubCategoryZod>;
