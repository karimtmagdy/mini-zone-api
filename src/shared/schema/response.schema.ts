import { z } from "zod/v4";
import { paginationZod } from "@/shared/schema/query.schema";

export const baseResponseZod = z.object({
  status: z.enum(["success", "fail", "error"]),
  message: z.string().optional(),
});

export const responseWithMetaZod = baseResponseZod.extend({
  meta: paginationZod.optional(),
  data: z.unknown().optional(),
});

export const responseZod = baseResponseZod.extend({
  data: z.unknown(),
});

export type ResponseWithMetaDto<T> = Omit<
  z.infer<typeof responseWithMetaZod>,
  "data"
> & {
  data: T;
};
export type ResponseDto<T> = Omit<z.infer<typeof responseZod>, "data"> & {
  data?: T;
};
