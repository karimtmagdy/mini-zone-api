import { NextFunction, Request, Response, Application } from "express";
import { z } from "zod/v4";
import { Error as MongooseError } from "mongoose";
import { AppError } from "../class/api.error.js";
import { STATUS_CODE } from "../lib/statuscode.js";
import { logger } from "../lib/logger.js";

function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const issues = (error as any).issues || (error as any).errors;

  if (!issues || !Array.isArray(issues)) {
    try {
      const parsedIssues = JSON.parse(error.message);
      if (Array.isArray(parsedIssues)) {
        return formatZodErrors({ issues: parsedIssues } as any);
      }
    } catch {}

    return { root: [error?.message || "Validation failed"] };
  }

  return issues.reduce<Record<string, string[]>>(
    (acc: Record<string, string[]>, err: any) => {
      const key =
        err.path && Array.isArray(err.path) && err.path.length > 0
          ? err.path.join(".")
          : "root";
      const arr = acc[key] || [];

      let msg = err.message || "Invalid value";

      // Only clean up default Zod messages if they are not custom messages
      if (
        msg === "Required" ||
        (err.code === "invalid_type" &&
          err.received === "undefined" &&
          msg === "Required")
      ) {
        const fieldName = err.path[err.path.length - 1] || "This field";
        msg = `${fieldName} is required`;
      } else if (
        err.code === "invalid_enum_value" ||
        msg.includes("Invalid option") ||
        msg.includes("Invalid enum value")
      ) {
        const fieldName = err.path[err.path.length - 1] || "this field";
        msg = `Please select a valid option for ${fieldName}`;
      }

      arr.push(msg);
      acc[key] = arr;
      return acc;
    },
    {},
  );
}

export function GlobalErrorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode || STATUS_CODE.SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  if (statusCode >= STATUS_CODE.SERVER_ERROR) {
    logger.error("❌ ERROR:", {
      status: err.status,
      statusCode,
      message,
      errors: err.errors,
      stack: err.stack,
    });
  }

  // 1. Zod Validation Error
  if (err instanceof z.ZodError || err.name === "ZodError") {
    const formattedErrors = formatZodErrors(err as z.ZodError);
    return res.status(STATUS_CODE.FAILED).json({
      status: "fail",
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  // 2. Mongoose Cast Error (Invalid ID, etc.)
  if (err instanceof MongooseError.CastError || err.name === "CastError") {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // 3. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = err.keyValue
      ? Object.keys(err.keyValue)[0] || "field"
      : "field";
    return res.status(STATUS_CODE.CONFLICT).json({
      status: "fail",
      message: `${field} already exists`,
    });
  }

  // 4. Mongoose Validation Error
  if (err.name === "ValidationError") {
    return res.status(STATUS_CODE.FAILED).json({
      status: "fail",
      message: err.message,
    });
  }

  // 5. Known App Error
  if (err instanceof AppError || err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Final fallback
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export const MissingRouteHandler = (app: Application) => {
  app.use("*", (req: Request, _res: Response, next: NextFunction) => {
    next(AppError.notFound(`Can't find ${req.originalUrl} on this server`));
  });

  app.use(GlobalErrorHandler);
};
// if (err instanceof z.ZodError || err.name === "ZodError") {
//   const formattedErrors = err.issues.map((issue: z.ZodIssue) => ({
//     field: issue.path.join("."),
//     message: issue.message,
//   }));
//   const summaryMessage = err.issues[0]?.message || "Validation Error";
//   return res.status(STATUS_CODE.BAD_REQUEST).json({
//     status: "fail",
//     message: summaryMessage,
//     errors: formattedErrors,
//   });
// }
