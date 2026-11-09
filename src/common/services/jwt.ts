import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
import { AccessTokenPayload } from "../middleware/token-payload";

export class JwtService {
  constructor(
    private readonly secret: string = process.env.JWT_ACCESS_TOKEN || "default_jwt_access_secret",
    private readonly expiresIn: string = process.env.JWT_ACCESS_TTL || "15m",
  ) {}

  sign(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this.secret as Secret, {
      expiresIn: this.expiresIn as StringValue,
    });
  }

  verify(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, this.secret as Secret);
    if (typeof decoded === "string" || !decoded.sub || !decoded.role) {
      throw new Error("invalid jwt payload");
    }
    const payload = decoded as JwtPayload & AccessTokenPayload;
    return {
      sub: payload.sub,
      role: payload.role,
      permissions: payload.permissions ?? [],
    };
  }
}

export const jwtUtil = new JwtService();
