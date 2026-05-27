import { z } from "zod/v4";

const sortOptions = z.enum(["asc", "desc"]).default("desc");

const defaultNum = z.coerce.number().int().positive();

export const StandradQueryZod = z.object({
  page: defaultNum.min(1).default(1),
  limit: defaultNum.min(1).max(50).default(5),
});

export const paginationZod = StandradQueryZod.extend({
  total: defaultNum.default(0),
  pages: defaultNum.default(0),
  results: defaultNum.default(0),
});

export const queryZod = StandradQueryZod.extend({
  search: z.string().min(1).default(""),
  sort: z
    .string()
    .regex(/^(-?[a-zA-Z_]+)(,-?[a-zA-Z_]+)*$/)
    .default("-createdAt"),
  sortOrder: sortOptions,
  skip: z.number().default(0),
  fields: z.string().default(""),
});

 

// export const getProductsSchema = z.object({
//   query: z.object({
//     page: z.string().optional().default("1"),
//     limit: z.string().optional().default("10"),
//     category: z.string().optional(),
//     brand: z.string().optional(),
//     minPrice: z.string().optional(),
//     maxPrice: z.string().optional(),
//     search: z.string().optional(),
//     sortBy: z
//       .enum(["name", "price", "createdAt", "stock", "ratings_average"])
//       .optional()
//       .default("createdAt"),
//     sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
//   }),
// });
// export type GetProductsQuery = z.infer<typeof getProductsSchema>["query"];
export type QueryStringDto = z.infer<typeof queryZod>;
export type PaginationDto = z.infer<typeof paginationZod>;
export type APIFeaturesResultDto<T> = {
  data: T[];
  meta: PaginationDto;
};