import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { enviro } from "./local.env.js";
import {
  CartPayload,
  IdPayload,
  TokenPayload,
} from "../unity/types/payload.types.js";

class JWT {
  private sign(
    payload: TokenPayload | IdPayload | CartPayload,
    secret: Secret,
    expiresIn: StringValue,
  ): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, secret, options);
  }
  private verify<T>(token: string, secret: Secret): T {
    return jwt.verify(token, secret) as T;
  }
  generateAccessToken(payload: TokenPayload): string {
    return this.sign(payload, enviro.jwtAccessToken, enviro.jwtAccessTTL);
  }
  verifyAccessToken(token: string): TokenPayload {
    return this.verify<TokenPayload>(token, enviro.jwtAccessToken);
  }
  generateRefreshToken(payload: IdPayload): string {
    return this.sign(payload, enviro.jwtRefreshToken, enviro.jwtRefreshTTL);
  }
  verifyRefreshToken(token: string): IdPayload {
    return this.verify<IdPayload>(token, enviro.jwtRefreshToken);
  }
  generateCartToken(payload: CartPayload): string {
    return this.sign(payload, enviro.jwtSecretCart, enviro.jwtCartTTL);
  }
  verifyCartToken(token: string): CartPayload {
    return this.verify<CartPayload>(token, enviro.jwtSecretCart);
  }
  generateResetToken(payload: IdPayload): string {
    return this.sign(payload, enviro.jwtResetSecret, enviro.jwtResetTTL);
  }
  verifyResetToken(token: string): IdPayload {
    return this.verify<IdPayload>(token, enviro.jwtResetSecret);
  }
  generateVerificationToken(payload: IdPayload): string {
    // Using accessToken secret for simplicity or dedicated secret if available
    return this.sign(payload, enviro.jwtAccessToken, enviro.genVerifyToken);
  }
  verifyVerificationToken(token: string): IdPayload {
    return this.verify<IdPayload>(token, enviro.jwtAccessToken);
  }
}

export const jwtUitl = new JWT();
