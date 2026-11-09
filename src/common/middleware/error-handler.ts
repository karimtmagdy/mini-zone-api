import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { AppError } from "../api/api-error";
import mongoose from "mongoose";

export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
    return;
  }
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      status: "fail",
      message: "db error",
      errors: Object.values(error.errors).map((item) => item.message),
    });
    return;
  }
  if (error?.code === 11000) {
    res.status(500).json({
      status: "fail",
      message: "duplicate value",
      fields: error.keyValue,
    });
    return;
  }
  console.error(error);
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};
