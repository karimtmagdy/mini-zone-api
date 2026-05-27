import { z } from "zod";

export const BaseResponseSchema = z.object({
  status: z.enum(["success", "error", "fail"]),
  message: z.string().optional(),
  data: z.any().nullable().optional(),
});
export const ExtendedResponseSchema = BaseResponseSchema.extend({
  results: z.number().optional(),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  pages: z.number().optional(),
  timestamp: z.string().optional(),
  // metadata: z.record(z.any()).optional(),
});

export const AuthResponseSchema = z.object({
  status: z.enum(["success", "error", "fail"]),
  message: z.string().optional(),
  user: z.any().nullable().optional(),
  token: z.string(),
});

export type BaseResponse = z.infer<typeof BaseResponseSchema>;
export type ExtendedResponse = z.infer<typeof ExtendedResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type StatusStaticType = "status" | "data" | "message";
