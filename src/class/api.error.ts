import { STATUS_CODE } from "../lib/statuscode.js";

export class ApiError extends Error {
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
