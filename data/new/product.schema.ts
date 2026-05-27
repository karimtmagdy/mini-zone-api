import { z } from "zod/v4";

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    search: z.string().optional(),
    sortBy: z
      .enum(["name", "price", "createdAt", "stock", "ratings_average"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

export type GetProductsQuery = z.infer<typeof getProductsSchema>["query"];
