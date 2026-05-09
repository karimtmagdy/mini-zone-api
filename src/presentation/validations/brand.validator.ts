import { z } from "zod/v4";
import { BRAND_STATUS, BrandStatusEnum } from "@/domain/types/brand.types";
import { imageZod } from "@/_R/validation/rules/shard.schema";
 
export const CoreBrandZod = z.object({
  name: z
    .string({ message: "brand name is required" })
    .min(2, { message: "brand name must be at least 2 characters long" })
    .max(30, { message: "brand name must be at most 30 characters long" }),
  status: z.enum(BRAND_STATUS).default(BrandStatusEnum.ACTIVE),
  image: imageZod.nullable(),
});

export const createBrandZod = CoreBrandZod.pick({
  name: true,
  status: true,
  image: true,
});
export const updateBrandZod = CoreBrandZod.partial({
  name: true,
  status: true,
  image: true,
});
export type CreateBrandZod = z.infer<typeof createBrandZod>;
export type UpdateBrandZod = z.infer<typeof updateBrandZod>;
