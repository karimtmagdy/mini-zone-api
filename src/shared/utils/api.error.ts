import { STATUS_CODE } from "@/shared/lib/statuscode";

class ApiError extends Error {
  status: string;
  isOperational: boolean;
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message || "An unknown error occurred");
    this.statusCode = statusCode || STATUS_CODE.SERVER_ERROR;
    const statusCodeStr = String(this.statusCode);
    this.status = statusCodeStr.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class AppError {
  // 400 Bad Request
  static badRequest(message: string): never {
    throw new ApiError(message, STATUS_CODE.BAD_REQUEST);
  }
  // 401 Unauthorized
  static unauthorized(message: string): never {
    throw new ApiError(message, STATUS_CODE.UNAUTHORIZED);
  }
  // 403 Forbidden
  static forbidden(message: string): never {
    throw new ApiError(message, STATUS_CODE.FORBIDDEN);
  }
  // 404 Not Found
  static notFound(message: string): never {
    throw new ApiError(message, STATUS_CODE.NOT_FOUND);
  }
  // 409 Conflict
  static conflict(message: string): never {
    throw new ApiError(message, STATUS_CODE.CONFLICT);
  }
  // 422 Validation Failed / Unprocessable Entity
  static validation(message: string): never {
    throw new ApiError(message, STATUS_CODE.FAILED);
  }
  // 500 Internal Server Error
  static internal(message: string = "Internal Server Error"): never {
    throw new ApiError(message, STATUS_CODE.SERVER_ERROR);
  }
  static jwtInvalid(): never {
    throw new ApiError(
      "Invalid token format or signature. Please log in again.",
      STATUS_CODE.UNAUTHORIZED,
    );
  }
  static jwtExpired(): never {
    throw new ApiError(
      "Your session has expired. Please login again.",
      STATUS_CODE.UNAUTHORIZED,
    );
  }
  static jwtDenied(): never {
    throw new ApiError(
      "You do not have permission to perform this action",
      STATUS_CODE.FORBIDDEN,
    );
  }
}
