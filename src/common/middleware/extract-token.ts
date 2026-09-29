import type { Request } from "express";
import { AppError } from "../api/api-error";

export const extractToken = (req: Request): string => {
  const authorization =
    req.headers.authorization ||
    req.get("authorization") ||
    req.header("authorization");
  if (!authorization)
    throw new AppError("Authentication header missing token", 401);
  const [scheme, token] = authorization.split(" "); //[1];
  if (scheme !== "Bearer" || !token)
    throw new AppError("Authorization format must be : Bearer <token>", 401);
  // Authorization: Bearer eyJhbGci...
  return token;
};
