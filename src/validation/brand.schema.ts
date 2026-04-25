import { z } from "zod/v4";
import { BRAND_STATUS, BrandStatusEnum } from "@/types/brand.dto";
import { imageZod } from "@/validation/rules/shard.schema";

export const CoreBrandZod = z.object({
  name: z
    .string({ message: "Brand name is required" })
    .min(2, { message: "Brand name must be at least 2 characters long" })
    .max(30, { message: "Brand name must be at most 30 characters long" }),
  status: z.enum(BRAND_STATUS).default(BrandStatusEnum.ACTIVE),
  image: imageZod,
});

// ✅ For create/update, only validate text fields (name, status)
// Image is handled by Multer → req.file → brand.service.ts
export const createBrandZod = CoreBrandZod.pick({
  name: true,
  status: true,
});

export const updateBrandZod = CoreBrandZod.pick({
  name: true,
  status: true,
  image: true,
}).partial();

export type CreateBrand = z.infer<typeof createBrandZod>;
export type UpdateBrand = z.infer<typeof updateBrandZod>;
