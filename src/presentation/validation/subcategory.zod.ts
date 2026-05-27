import { z } from "zod";
import {
  SUBCATEGORY_STATUS,
  SubCategoryEnum,
} from "@/domain/types/subcategory.types";
import { imageZod } from "@/shared/schema/shard.schema";

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
  image: imageZod,
});

export const createSubCategoryZod = CoreSubCategory.pick({
  name: true,
  category: true,
  status: true,
  image: true,
}).partial({
  status: true,
  image: true,
});

export const updateSubCategoryZod = CoreSubCategory.pick({
  name: true,
  category: true,
  status: true,
  image: true,
}).partial();

export type CreateSubCategoryDTO = z.infer<typeof createSubCategoryZod>;
export type UpdateSubCategoryDTO = z.infer<typeof updateSubCategoryZod>;
