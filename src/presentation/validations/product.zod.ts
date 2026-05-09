import { z } from "zod/v4";
import { PRODUCT_STATUS } from "@/domain/types/product.types";

export const CoreProductZod = z
  .object({
    name: z
      .string({ message: "Product name is required" })
      .min(3, { message: "Product name must be at least 3 characters long" })
      .max(100, {
        message: "Product name must be at most 100 characters long",
      }),
    description: z
      .string({ message: "Product description is required" })
      .min(10, {
        message: "Product description must be at least 10 characters long",
      })
      .max(1000, {
        message: "Product description must be at most 1000 characters long",
      }),
    price: z
      .number({ message: "Product price is required" })
      .int()
      .min(0, { message: "Price must be at least 0" }),
    discount: z
      .number()
      .int()
      .min(0, { message: "Discount price must be at least 0" })
      .max(100, { message: "discount cannot be greater than 100" })
      .default(0)
      .optional(),
    stock: z
      .number({ message: "Product stock is required" })
      .int()
      .min(0, { message: "Stock must be at least 0" })
      .nonnegative({ message: "the quantity must be zero or greater." })
      .default(0),
    sold: z.number().nonnegative().default(0),
    brand: z.string({ message: "Product brand is required" }),
    category: z.array(z.string()).min(1),
    subcategory: z.array(z.string()).optional(),
    status: z.enum(PRODUCT_STATUS).optional(),
    colors: z.array(z.string()).optional(),
    images: z
      .array(z.object({ url: z.string(), publicId: z.string() }))
      .max(5, { message: "You can upload a maximum of 5 images" })
      .optional(),
    tags: z
      .array(z.string())
      .max(10, { message: "Tags must be at most 10" })
      .optional(),
    sku: z.string().optional(),
    ratings: z
      .object({
        average: z.number().min(0).max(5),
        count: z.number().min(0),
      })
      .optional(),
  })
  .strict();

export const createProductZod = CoreProductZod;

export const updateProductZod = CoreProductZod.pick({
  name: true,
  description: true,
  price: true,
  stock: true,
  brand: true,
  category: true,
  subcategory: true,
  status: true,
  colors: true,
  images: true,
  tags: true,
  sku: true,
})
  .refine((data) => data.status, {
    message: "select a valid status",
  })
  .strict();

export const updateStockZod = CoreProductZod.pick({
  stock: true,
});
export type CreateProductZod = z.infer<typeof createProductZod>;
export type UpdateProductZod = z.infer<typeof updateProductZod>;
export type UpdateStockZod = z.infer<typeof updateStockZod>;
