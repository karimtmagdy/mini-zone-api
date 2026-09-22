export const ErrorCode = {
  INTERNAL_ERROR: "INTERNAL_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  JWT_INVALID: "JWT_INVALID",
  JWT_EXPIRED: "JWT_EXPIRED",
  MONGO_DUPLICATE_KEY: "MONGO_DUPLICATE_KEY",
  MONGO_CAST_ERROR: "MONGO_CAST_ERROR",
  MONGO_VALIDATION_ERROR: "MONGO_VALIDATION_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode][number];
type ErrorStatus = "error" | "fail";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly status: ErrorStatus;
  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    isOperational = true,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    const statusCodeStr = String(this.statusCode);
    this.status = statusCodeStr.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
    // Object.setPrototypeOf(this, new.target.prototype);
    // Object.setPrototypeOf(this, AppError.prototype);
  }
}
