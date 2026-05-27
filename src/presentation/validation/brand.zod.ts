import { z } from "zod/v4";
import { BrandStatusEnum } from "@/domain/types/brand.types";
import { imageZod } from "@/shared/schema/shard.schema";

export const CoreBrandZod = z.object({
  // id: z.string(),
  name: z
    .string({ message: "brand name is required" })
    .min(2, { message: "brand name must be at least 2 characters long" })
    .max(30, { message: "brand name must be at most 30 characters long" }),
  status: z.nativeEnum(BrandStatusEnum).default(BrandStatusEnum.ACTIVE),
  image: imageZod,
  products: z.number(),
  slug: z.string(),
  deletedAt: z.coerce.date().or(z.null()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createBrandZod = CoreBrandZod.pick({
  name: true,
  status: true,
  image: true,
}).partial({
  status: true,
  image: true,
});

export const updateBrandZod = CoreBrandZod.pick({
  name: true,
  status: true,
  image: true,
}).partial();

export const updateBrandStatusZod = z.object({
  status: z.nativeEnum(BrandStatusEnum, {
     error: "Invalid status value",
     message: "status is required",
  }),
});

export type CreateBrandDTO = z.infer<typeof createBrandZod>;
export type UpdateBrandDTO = z.infer<typeof updateBrandZod>;
export type UpdateBrandStatusDTO = z.infer<typeof updateBrandStatusZod>;
