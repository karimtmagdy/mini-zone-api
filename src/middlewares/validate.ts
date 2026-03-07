import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod/v4";

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
      return next(result.error);
    }

    req[target] = result.data;
    next();
  };
