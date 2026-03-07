import { NextFunction, Request, Response } from "express";
import { jwtUitl } from "../lib/jwt.lib.js";
import { catchError } from "../lib/catch.error.js";
import { UserRole } from "../unity/types/user.types.js";
import { AppError } from "../class/api.error.js";

export const authenticated = catchError(
  async (req: Request, _: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) AppError.unauthorized("No authentication header provided");
    const token = authHeader.split(" ")[1];
    if (!token) AppError.unauthorized("No authentication token provided");
    try {
      const decodedToken = jwtUitl.verifyAccessToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      AppError.jwtInvalid();
    }
  },
);

export const checkPermission = (
  roles: UserRole[] = ["super-admin", "admin", "manager", "hr", "viewer"],
) =>
  catchError(async (req: Request, _: Response, next: NextFunction) => {
    const user = req.user;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!user) AppError.unauthorized("No user found");

    if (!requiredRoles.includes(user.role as UserRole)) {
      AppError.jwtDenied();
    }
    next();
  });
