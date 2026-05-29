import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { enviro } from "@/shared/lib/local.env";
import { CartPayload, IdPayload, TokenPayload } from "@/types/payload.types";

class JwtService {
  private signToken(
    payload: TokenPayload | IdPayload | CartPayload,
    secret: Secret,
    expiresIn: StringValue,
  ): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, secret, options);
  }

  private verifyToken<T>(token: string, secret: Secret): T {
    return jwt.verify(token, secret) as T;
  }

  create = {
    accessToken: (payload: TokenPayload): string => {
      return this.signToken(
        payload,
        enviro.jwtAccessToken,
        enviro.jwtAccessTTL,
      );
    },

    refreshToken: (payload: IdPayload): string => {
      return this.signToken(
        payload,
        enviro.jwtRefreshToken,
        enviro.jwtRefreshTTL,
      );
    },

    resetToken: (payload: IdPayload): string => {
      return this.signToken(payload, enviro.jwtResetSecret, enviro.jwtResetTTL);
    },

    cartToken: (payload: CartPayload): string => {
      return this.signToken(payload, enviro.jwtSecretCart, enviro.jwtCartTTL);
    },

    verificationToken: (payload: IdPayload): string => {
      return this.signToken(
        payload,
        enviro.jwtAccessToken,
        enviro.genVerifyToken,
      );
    },
  };

  decode = {
    accessToken: (token: string): TokenPayload => {
      return this.verifyToken<TokenPayload>(token, enviro.jwtAccessToken);
    },

    refreshToken: (token: string): IdPayload => {
      return this.verifyToken<IdPayload>(token, enviro.jwtRefreshToken);
    },

    verificationToken: (token: string): IdPayload => {
      return this.verifyToken<IdPayload>(token, enviro.jwtAccessToken);
    },

    resetToken: (token: string): IdPayload => {
      return this.verifyToken<IdPayload>(token, enviro.jwtResetSecret);
    },

    cartToken: (token: string): CartPayload => {
      return this.verifyToken<CartPayload>(token, enviro.jwtSecretCart);
    },
  };
}

export const jwtUtil = new JwtService();
