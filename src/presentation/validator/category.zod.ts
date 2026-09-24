import { z } from "zod/v4";
import { CATEGORY_STATUS, ICategory } from "@/domain/types/category.types";

type Omitted = z.ZodType<Omit<ICategory, "isArchived" | "archivedAt">>;

export const CoreCategory = z
  .object({
    name: z
      .string({ error: "category name is required" })
      .min(3, { error: "category name must be at least 3 characters long" })
      .max(30, { error: "category name must be at most 30 characters long" }),
    status: z
      .enum(CATEGORY_STATUS, { error: "Invalid status value" })
      .default("inactive"),
    slug: z.string().check(z.slugify()),
    products: z.number().int().nonnegative(),
    isArchived: z.boolean().default(false),
    archivedAt: z.date().nullable(),
  })
  .strict() satisfies Omitted;

export const createCategory = CoreCategory.pick({
  name: true,
  status: true,
}).partial({ status: true });

export const updateCategory = CoreCategory.pick({
  name: true,
  status: true,
}).partial({
  name: true,
  status: true,
});
export const updateCategoryStatus = CoreCategory.pick({ status: true });
export const CategoryStatusEnum = z.enum(CATEGORY_STATUS, {
  error: "Invalid status value",
});

export type TCreateCategoryEX = z.infer<typeof createCategory>;
export type TUpdateCategoryEX = z.infer<typeof updateCategory>;
export type TUpdateCategoryStatusEX = z.infer<typeof updateCategoryStatus>;
export type TCategoryStatusEnum = z.infer<typeof CategoryStatusEnum>;
