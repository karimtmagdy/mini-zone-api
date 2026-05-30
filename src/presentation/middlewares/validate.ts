import { catchError } from "@/shared/lib/catch.error";
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod/v4";

type ValidationTarget = "body" | "query" | "params";

/**
 * validate — Express middleware factory for Zod schema validation.
 * Parses and replaces req[target] with the validated + typed data.
 */
export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      console.log(
        "❌ Validation Error Details:",
        JSON.stringify(result.error.format(), null, 2),
      );
      return next(result.error);
    }

    req[target] = result.data;
    next();
  };

const validation = (schema: ZodSchema, target: ValidationTarget): void => {
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    try {
      if (!result.success) {
      }
    } catch (error) {
      next(error);
    }
  };
};
