import { UserRepoType, UserRoleEnum } from "@/domain/types/user.types";
import { SessionRepoType, IDeviceInfo } from "@/domain/types/session.types";
import { LoginDTO } from "@/presentation/validation/auth.zod";
import { AppError } from "@/shared/utils/api.error";
import { jwtUtil } from "@/application/services/jwt.service";
import { enviro } from "@/shared/lib/local.env";
import ms from "ms";
import bcrypt from "bcryptjs";
import {
  IPerson,
  PErsonStateEnum,
  PersonStatusEnum,
} from "@/domain/types/person.types";
import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";

export type LoginResponse =
  | { status: "2FA_REQUIRED"; loginToken: string }
  | {
      user: {
        id: string;
        email: string;
        username: string;
        role: string;
        kind?: string;
      };
      token: string;
      refreshToken: string;
    };

export class LoginUser {
  constructor(
    private userRepo: UserRepoType,
    private sessionRepo: SessionRepoType,
    private recordActivity: RecordActivity,
  ) {}

  async execute(
    dto: LoginDTO,
    deviceInfo: IDeviceInfo,
  ): Promise<LoginResponse> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.password) {
      throw AppError.unauthorized("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password!);
    if (!isMatch) {
      await this.handleFailedLogin(user);
      throw AppError.unauthorized("Invalid credentials");
    }

    // Status checks
    this.handleStatus(user);
    // Handle successful login (resets attempts, updates status/state)
    await this.handleSuccessfulLogin(user);
    // 2FA Check
    if (user.twoFactorEnabled) {
      const loginToken = jwtUtil.create.resetToken({ id: user.id! });
      return { status: "2FA_REQUIRED", loginToken };
    }
    // Generate Tokens
    const payload = {
      id: user.id!,
      email: user.email,
      username: user.username,
      role: user.role || UserRoleEnum.USER,
      kind: (user as any).kind,
    };
    const token = jwtUtil.create.accessToken(payload);
    const refreshToken = jwtUtil.create.refreshToken({ id: user.id! });

    // Session Management
    const expiresIn = (enviro.jwtRefreshTTL as ms.StringValue) || "7d";
    const parsedMs = ms(expiresIn);
    const expiresDuration = typeof parsedMs === "number" ? parsedMs : ms("7d");
    const expiresAt = new Date(Date.now() + expiresDuration);

    await this.sessionRepo.create({
      userId: user.id!,
      refreshToken,
      deviceInfo,
      expiresAt,
    });

    await this.recordActivity.execute({
      user: {
        username: user.username,
        email: user.email,
        role: user.role || UserRoleEnum.USER,
        image: user.image
          ? {
              url: user.image.url || "",
              publicId: user.image.publicId || "",
            }
          : undefined,
      },
      action: "User logged in",
      target: "System",
      details: { deviceInfo },
      timestamp: new Date(),
    });

    return {
      user: payload,
      token,
      refreshToken,
    };
  }

  private handleStatus(user: IPerson) {
    const now = new Date();
    switch (user.status) {
      case PersonStatusEnum.BANNED:
        throw AppError.forbidden("Your account has been banned.");
      case PersonStatusEnum.DEACTIVATED:
        throw AppError.forbidden("Your account has been deactivated.");
      case PersonStatusEnum.INACTIVE:
        throw AppError.forbidden("Your account is not active.");
      case PersonStatusEnum.LOCKED:
        if (user.lockedUntil && user.lockedUntil > now) {
          const remainingMinutes = Math.ceil(
            (user.lockedUntil.getTime() - now.getTime()) / (1000 * 60),
          );
          AppError.forbidden(
            `Account is locked. Please try again in ${remainingMinutes} minutes.`,
          );
        }
    }
  }
  private async handleSuccessfulLogin(user: IPerson) {
    await this.userRepo.update(user.id!, {
      state: PErsonStateEnum.ONLINE,
      lastLoginAt: new Date(),
      failedLoginAttempts: 0,
    });
  }

  private async handleFailedLogin(user: IPerson) {
    const maxFailedAttempts = 5;
    const lockDurationMinutes = 30;

    const failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    const updates: Partial<IPerson> = { failedLoginAttempts };

    if (failedLoginAttempts >= maxFailedAttempts) {
      updates.status = PersonStatusEnum.LOCKED;
      updates.lockedUntil = new Date(
        Date.now() + lockDurationMinutes * 60 * 1000,
      );
    }

    await this.userRepo.update(user.id!, updates);
  }
}
// Please contact support.
// "Your account is pending verification. Please check your email.",
// "Account not found."
