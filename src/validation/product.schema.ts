import { z } from "zod/v4";
import { PRODUCT_STATUS, ProductStatusEnum } from "@/types/product.dto";
import { imageZod } from "@/validation/rules/shard.schema";

export const CoreProductZod = z
  .object({
    name: z
      .string({ message: "Product name is required" })
      .min(2, { message: "Product name must be at least 2 characters long" })
      .max(30, {
        message: "Product name must be at most 30 characters long",
      }),
    price: z
      .number({ message: "Price is required" })
      .min(0, { message: "Price must be at least 0" }),
    quantity: z
      .number({ message: "Quantity is required" })
      .min(0, { message: "Quantity must be at least 0" }),
    category: z.string({ message: "Category ID is required" }),
    brand: z.string({ message: "Brand ID is required" }),
    status: z.enum(PRODUCT_STATUS).default(ProductStatusEnum.ACTIVE),
    image: imageZod.optional(),
  })
  .strict();

export const createProductZod = CoreProductZod;

export const updateProductZod = CoreProductZod.partial().strict();

export type CreateProduct = z.infer<typeof createProductZod>;
export type UpdateProduct = z.infer<typeof updateProductZod>;
