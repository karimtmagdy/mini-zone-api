import { AppError } from "@/class/api.error";
import { UserRepo, userRepo } from "@/repo/user.repo";
import { DeviceInfo } from "@/types/session.dto";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { SessionRepo, sessionRepo } from "@/repo/session.repo";
import { TokenPayload } from "@/types/payload.types";
import {
  UserRoleEnum,
  UserStatusEnum,
} from "@/types/user.types";
import { enviro } from "@/lib/local.env";
import ms from "ms";
import { jwtUitl } from "@/lib/jwt.lib";

class TOWFAServices {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly sessionRepo: SessionRepo,
  ) {}

  async setup2FA(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) AppError.notFound("User not found");
    const secret = speakeasy.generateSecret({
      name: `A-Z Express (${user.email})`,
    });
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url || "");
    // Temporarily save secret (not enabled yet)
    await user.updateOne({ $set: { twoFactorSecret: secret.base32 } });
    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
    };
  }

 private async verify2FA(userId: string, token: string) {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.twoFactorSecret) {
      AppError.badRequest("2FA is not set up");
    }
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });
    if (!verified) {
      AppError.badRequest("Invalid 2FA token");
    }

    return user;
  }

  async enable2FA(userId: string, token: string) {
    await this.verify2FA(userId, token);
    const user = await this.userRepo.findById(userId);
    if (user) {
      user.twoFactorEnabled = true;
      await user.save();
    }
    return { message: "2FA enabled successfully" };
  }

  async disable2FA(userId: string, token: string) {
    await this.verify2FA(userId, token);
    const user = await this.userRepo.findById(userId);
    if (user) {
      user.twoFactorEnabled = false;
      await user.updateOne({ $unset: { twoFactorSecret: "" } });
      await user.save();
    }
    return { message: "2FA disabled successfully" };
  }

  async loginWith2FA(
    loginToken: string,
    token2FA: string,
    reqDeviceInfo: DeviceInfo,
  ) {
    // Using verification logic for temp token
    const payload = jwtUitl.verification.resetToken(loginToken);
    const user = await this.userRepo.findById(payload.id);

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      AppError.unauthorized("Invalid request");
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token2FA,
    });

    if (!verified) {
      AppError.badRequest("Invalid 2FA token");
    }

    // Success: Generate full tokens
    const userPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role ?? UserRoleEnum.USER,
    };

    const token = jwtUitl.generate.access(userPayload);
    const refreshToken = jwtUitl.generate.refresh({ id: user.id });

    const expiresIn = (enviro.jwtRefreshTTL as ms.StringValue) || "7d";
    const expiresDuration = ms(expiresIn) || ms("7d");
    const expiresAt = new Date(
      Date.now() + (typeof expiresDuration === "number" ? expiresDuration : 0),
    );

    await this.sessionRepo.create({
      userId: user.id,
      refreshToken,
      deviceInfo: reqDeviceInfo,
      expiresAt,
    });

    return { user: userPayload, token, refreshToken };
  }

  async verifyEmail(token: string) {
    const payload = jwtUitl.verification.verifyVerificationToken(token);
    const user = await this.userRepo.findById(payload.id);
    if (!user) AppError.unauthorized("User not found");
    if (user.status === UserStatusEnum.ACTIVE) {
      return { message: "Email already verified", user };
    }
    user.status = UserStatusEnum.ACTIVE;
    user.verifiedAt = new Date();
    await user.save();
    //     // After verification, we can send the welcome email
    //     await this.notifyService.sendWelcomeEmail(user.email, user.username);
    return { user };
  }
}
export const towfaService = new TOWFAServices(userRepo, sessionRepo);
