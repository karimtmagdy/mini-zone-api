import { Response } from "express";

import {
  ExtendedResponse,
  ExtendedResponseSchema,
  AuthResponse,
  AuthResponseSchema,
  StatusStaticType,
} from "@/schema/base.schema";

import { AppError } from "../../middleware/api.error";

export class ResponseHandler {
  // Response Success
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    extras?: Partial<Omit<ExtendedResponse, StatusStaticType>>
  ) {
    const response: ExtendedResponse = {
      status: "success" as const,
      message: message ?? "Operation successful",
      data,
      ...extras,
    };
    const validated = ExtendedResponseSchema.parse(response);
    return res.status(200).json(validated);
  }
  // Success with Token (للـ auth responses)
  static successWithToken<T>(
    res: Response,
    user: T,
    token: string,
    message?: string
  ) {
    const response: AuthResponse = {
      status: "success" as const,
      message: message ?? "Operation successful",
      user,
      token,
    };
    const validated = AuthResponseSchema.parse(response);
    return res.status(200).json(validated);
  }
  // Create
  static created<T>(
    res: Response,
    data?: T,
    message?: string,
    extras?: Partial<Omit<ExtendedResponse, StatusStaticType>>
  ) {
    const response = {
      status: "success" as const,
      message: message ?? "Resource created successfully",
      data,
      ...extras,
    };

    const validated = ExtendedResponseSchema.parse(response);

    return res.status(201).json(validated);
  }

  // Pagination
  static paginated<T>(
    res: Response,
    data: T[],
    totalCount: number,
    page: number,
    limit: number,
    message?: string
  ) {
    const totalPages = Math.ceil(totalCount / limit);

    const response: ExtendedResponse = {
      status: "success",
      message: message ?? "Data retrieved successfully",
      data,
      totalCount,
      page,
      limit,
      totalPages,
    };

    const validated = ExtendedResponseSchema.parse(response);

    return res.status(200).json(validated);
  }
  // Update
  static updated<T>(
    res: Response,
    data?: T,
    message?: string,
    extras?: Partial<Omit<ExtendedResponse, StatusStaticType>>
  ) {
    const response = {
      status: "success" as const,
      message: message ?? "Resource updated successfully",
      data,
      ...extras,
    };

    const validated = ExtendedResponseSchema.parse(response);

    return res.status(200).json(validated);
  }
  // Delete
  static deleted(
    res: Response,
    message?: string,
    extras?: Partial<Omit<ExtendedResponse, StatusStaticType>>
  ) {
    const response = {
      status: "success" as const,
      message: message ?? "Resource deleted successfully",
      data: null,
      ...extras,
    };

    const validated = ExtendedResponseSchema.parse(response);

    return res.status(200).json(validated);
  }
  // Handle Errors
  static handleError(res: Response, error: AppError | Error) {
    if (error instanceof AppError) {
      const response = {
        status: error.status as "error" | "fail",
        message: error.message,
        data: null,
      };

      const validated = ExtendedResponseSchema.parse(response);

      return res.status(error.statusCode).json(validated);
    }

    const response = {
      status: "error" as const,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      data:
        process.env.NODE_ENV === "development" ? { stack: error.stack } : null,
    };

    const validated = ExtendedResponseSchema.parse(response);

    return res.status(500).json(validated);
  }
  // Error
  static error<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    extras?: Partial<Omit<ExtendedResponse, StatusStaticType>>
  ) {
    const status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    const response: ExtendedResponse = {
      status: status as unknown as "error" | "fail",
      message,
      data,
      ...extras,
    };

    const validated = ExtendedResponseSchema.parse(response);

    return res.status(statusCode).json(validated);
  }
  // Fail
  static fail<T>(
    res: Response,
    message: string,
    data?: T,
    extras?: Partial<Omit<ExtendedResponse, StatusStaticType>>
  ) {
    const response: ExtendedResponse = {
      status: "fail" as const,
      message,
      data,
      ...extras,
    };

    const validated = ExtendedResponseSchema.parse(response);

    return res.status(400).json(validated);
  }
  // Not Found
  static notFound(res: Response, message: string = "Resource not found") {
    return this.error(res, 404, message);
  }
  // Forbidden
  static forbidden(res: Response, message: string = "Access forbidden") {
    return this.error(res, 403, message);
  }
  // Unauthorized
  static unauthorized(res: Response, message: string = "Unauthorized access") {
    return this.error(res, 401, message);
  }
  // Custom
  static custom(res: Response, statusCode: number, response: ExtendedResponse) {
    const validated = ExtendedResponseSchema.parse(response);

    return res.status(statusCode).json(validated);
  }
  // Bad
  static badRequest<T>(res: Response, message: string, data?: T) {
    return this.fail(res, message, data);
  }
}
