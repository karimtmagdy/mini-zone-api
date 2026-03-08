import { z } from "zod/v4";
import {
  responseWithMetaZod,
  responseZod,
} from "../../validation/rules/response.schema.js";

export type ResponseWithMetaDto<T> = Omit<
  z.infer<typeof responseWithMetaZod>,
  "data"
> & {
  data: T;
};
export type ResponseDto<T> = Omit<z.infer<typeof responseZod>, "data"> & {
  data?: T;
};
