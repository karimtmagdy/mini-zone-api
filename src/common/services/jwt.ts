import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import { AppError, ErrorCode } from "@/common/api/api-error";
import type { AccessTokenPayload } from "../middleware/token-payload";

export interface IIssuedToken {
  token: string;
  expiresAt: Date;
}

export class JwtService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  sign(payload: Omit<AccessTokenPayload, "type">): string {
    return jwt.sign({ ...payload, type: "access" }, this.secret as Secret, {
      expiresIn: this.expiresIn as StringValue,
    });
  }

  issue(payload: Omit<AccessTokenPayload, "type">): IIssuedToken {
    const token = this.sign(payload);
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded?.exp) {
      throw new AppError(
        "failed to issue token",
        500,
        ErrorCode.INTERNAL_ERROR,
      );
    }
    return { token, expiresAt: new Date(decoded.exp * 1000) };
  }

  verify(token: string): AccessTokenPayload {
    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(token, this.secret as Secret);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError("token has expired", 401, ErrorCode.JWT_EXPIRED);
      }
      throw new AppError("invalid token", 401, ErrorCode.JWT_INVALID);
    }

    if (
      typeof decoded === "string" ||
      !decoded.sub ||
      decoded.type !== "access"
    ) {
      throw new AppError("invalid token payload", 401, ErrorCode.JWT_MALFORMED);
    }

    return {
      sub: String(decoded.sub),
      role: decoded.role,
      permissions: decoded.permissions ?? [],
      type: "access",
    } as unknown as AccessTokenPayload;
  }
}

export const jwtUtil = new JwtService(
  process.env.JWT_ACCESS_TOKEN,
  process.env.JWT_ACCESS_TTL || "15m",
);
