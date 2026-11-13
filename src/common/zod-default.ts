import { z } from "zod/v4";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .refine((v) => (v ? SLUG_REGEX.test(v) : true), {
    error: "slug must contain only lowercase letters, numbers, and hyphens",
  });
