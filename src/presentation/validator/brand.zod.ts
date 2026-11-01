import { z } from "zod/v4";
import { BRAND_STATUS, IBrand } from "@/domain/types/brand.types";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Omitted = z.ZodType<Partial<Omit<IBrand, "isArchived">>>;

export const CoreBrand = z.object({
  name: z
    .string({ error: "brand name is required" })
    .trim()
    .min(2, { error: "brand name must be at least 2 characters long" })
    .max(30, { error: "brand name must be at most 30 characters long" }),
  status: z
    .enum(BRAND_STATUS, { error: "Invalid status value" })
    .default("inactive"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .refine((v) => (v ? SLUG_REGEX.test(v) : true), {
      error: "slug must contain only lowercase letters, numbers, and hyphens",
    }),
  products: z.number().int().nonnegative(),
  isArchived: z.boolean().default(false),
  archivedAt: z.date().nullable(),
}) satisfies Omitted;

export const createBrand = CoreBrand.pick({
  name: true,
  status: true,
}).partial({ status: true });

export const updateBrand = CoreBrand.pick({ name: true, status: true }).partial(
  {
    name: true,
    status: true,
  },
);
export const updateBrandStatus = CoreBrand.pick({ status: true });
export const BrandStatusEnum = z.enum(BRAND_STATUS, {
  error: "Invalid status value",
});

export type TCreateBrandEX = z.infer<typeof createBrand>;
export type TUpdateBrandEX = z.infer<typeof updateBrand>;
export type TUpdateBrandStatusEX = z.infer<typeof updateBrandStatus>;
export type TBrandStatusEnum = z.infer<typeof BrandStatusEnum>;
