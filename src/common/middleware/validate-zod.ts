import { z } from "zod/v4";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { formatZodErrors } from "./format-zod";

// export function validate(schema: z.ZodObject): RequestHandler {
export function validate<T extends z.ZodAny>(schema: T): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({
        status: "fail",
        message: "validation failed",
        // errors: result.error.flatten(),
        err: errors,
      });
      return;
    }
    req.body = result.data.body;
    req.params = result.data.params as typeof req.params;
    for (const key of Object.keys(result.data.query)) {
      req.query[key] = String(
        result.data.query[key as keyof typeof result.data.query],
      );
    }
    next();
  };
}
