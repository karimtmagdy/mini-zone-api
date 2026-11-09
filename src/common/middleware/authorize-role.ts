import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../api/api-error";
import { TUserRole } from "@/domain/types/user.types";

export const authorizeRoles = (
  ...allowedRoles: TUserRole[]
): RequestHandler => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("authentication required", 401));
      return;
    }
    if (allowedRoles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to access this resource", 403),
      );
      return;
    }
    next();
  };
};
