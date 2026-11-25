import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../api/api-error";
import { TPermission } from "@/domain/types/user.types";

export const requirePermission = (permission: TPermission): RequestHandler => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }
    const hasPermission = req.user.permissions.includes(permission);
    if (!hasPermission) {
      next(new AppError(`missing permission: ${permission}`, 403));
      return;
    }
    next();
  };
};

export const requirePermissions = (
  permissions: TPermission[],
): RequestHandler => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }
    const allowed = permissions.every((permission) =>
      req.user!.permissions.includes(permission),
    );
    if (!allowed) {
      next(new AppError(`You do not have the required ${permissions}`, 403));
      return;
    }
    next();
  };
};
