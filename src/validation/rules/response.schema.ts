import { z } from "zod/v4";
import { paginationZod } from "./query.schema.js";

export const baseResponseZod = z.object({
  status: z.enum(["success", "fail", "error"]),
  message: z.string().optional(),
});

export const responseWithMetaZod = baseResponseZod.extend({
  data: z.unknown().optional(),
  meta: paginationZod.optional(),
});

export const responseZod = baseResponseZod.extend({
  data: z.unknown(),
});
