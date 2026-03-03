import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

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
      const errors = formatZodErrors(result.error);
      res.status(422).json({
        status: "fail",
        message: "Validation failed",
        errors,
      });
      return;
    }

    req[target] = result.data;
    next();
  };

function formatZodErrors(error: ZodError): Record<string, string[]> {
  return error.errors.reduce<Record<string, string[]>>((acc, err) => {
    const key = err.path.join(".") || "root";
    if (!acc[key]) acc[key] = [];
    acc[key].push(err.message);
    return acc;
  }, {});
}
