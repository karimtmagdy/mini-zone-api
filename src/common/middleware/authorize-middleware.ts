import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../api/api-error";
import { extractToken } from "./extract-token";
import { jwtUtil } from "../services/jwt";

export const authenticated: RequestHandler = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req);
    const payload = jwtUtil.verify(token);
    req.user = payload;
    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError("invalid or expired authentication token", 401),
    );
  }
};
