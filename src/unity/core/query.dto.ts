import { z } from "zod/v4";
import { paginationZod, queryZod } from "../../validation/rules/query.schema";

export type QueryStringDto = z.infer<typeof queryZod>;
export type APIFeaturesResultDto<T> = {
  data: T[];
  pagination: PaginationDto;
};
export type PaginationDto = z.infer<typeof paginationZod>;
