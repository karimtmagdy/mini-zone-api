import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { enviro } from "@/lib/local.env";
import { CartPayload, IdPayload, TokenPayload } from "@/types/payload.types";

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
  //
  generate = {
    access: (payload: TokenPayload): string => {
      return this.sign(payload, enviro.jwtAccessToken, enviro.jwtAccessTTL);
    },
    refresh: (payload: IdPayload): string => {
      return this.sign(payload, enviro.jwtRefreshToken, enviro.jwtRefreshTTL);
    },
    resetToken: (payload: IdPayload): string => {
      return this.sign(payload, enviro.jwtResetSecret, enviro.jwtResetTTL);
    },
    cartToken: (payload: CartPayload): string => {
      return this.sign(payload, enviro.jwtSecretCart, enviro.jwtCartTTL);
    },
    generateVerificationToken: (payload: IdPayload): string => {
      // Using accessToken secret for simplicity or dedicated secret if available
      return this.sign(payload, enviro.jwtAccessToken, enviro.genVerifyToken);
    },
  };
  verification = {
    access: (token: string): TokenPayload => {
      return this.verify<TokenPayload>(token, enviro.jwtAccessToken);
    },
    refresh: (token: string): IdPayload => {
      return this.verify<IdPayload>(token, enviro.jwtRefreshToken);
    },
    verifyVerificationToken: (token: string): IdPayload => {
      return this.verify<IdPayload>(token, enviro.jwtAccessToken);
    },
    resetToken: (token: string): IdPayload => {
      return this.verify<IdPayload>(token, enviro.jwtResetSecret);
    },
    cartToken: (token: string): CartPayload => {
      return this.verify<CartPayload>(token, enviro.jwtSecretCart);
    },
  };
  //
}

export const jwtUitl = new JWT();
