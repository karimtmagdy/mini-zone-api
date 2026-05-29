import ms from "ms";
import { jwtUitl } from "@/shared/lib/jwt.lib";
import { enviro } from "@/shared/lib/local.env";
import { DeviceInfo } from "@/domain/types/session.types";
import { TokenPayload } from "@/types/payload.types";
import {
  IPerson,
  UserRoleEnum,
  UserStateEnum,
  UserStatusEnum,
} from "@/_R/user.types";
import { AppError } from "@/shared/utils/api.error";
import { SessionRepo, sessionRepo } from "@/_R/session.repo";
import { UserRepo, userRepo } from "@/_R/user.repo";
import { NotifyService, notifyService } from "./notify.service";

export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private notifyService: NotifyService,
    private readonly sessionRepo: SessionRepo,
  ) {}

  async logout(refreshToken: string) {
    const session = await this.sessionRepo.findByToken(refreshToken);
    if (!session) return;
    const user = await this.userRepo.findById(session.userId.toString());
    if (user) {
      await user.updateOne({
        $set: { state: UserStateEnum.OFFLINE, logoutAt: new Date() },
      });
    }
    await this.sessionRepo.deleteByToken(refreshToken);
  }
  async logoutOtherDevices(userId: string, currentToken: string) {
    const user = await this.userRepo.findById(userId);
    await this.sessionRepo.deleteOtherSessions(userId, currentToken);
    await user?.updateOne({ $unset: { logoutAt: new Date() } });
  }
  async refresh(refreshToken: string, reqDeviceInfo: DeviceInfo) {
    const payload = jwtUitl.verification.refresh(refreshToken);
    const session = await this.sessionRepo.findByToken(refreshToken);
    if (!session) AppError.unauthorized("Invalid or expired refresh token");
    const user = await this.userRepo.findById(payload.id);
    if (!user || user.status !== UserStatusEnum.ACTIVE) {
      AppError.unauthorized("User not found or inactive");
    }
    // Token Rotation Logic:
    // 1. Delete the old session
    await this.sessionRepo.deleteByToken(refreshToken);
    // 2. Generate new tokens
    const newTokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role || UserRoleEnum.USER,
    };
    const token = jwtUitl.generate.access(newTokenPayload);
    const newRefreshToken = jwtUitl.generate.refresh({ id: user.id });
    // 3. Create new session
    const expiresIn = (enviro.jwtRefreshTTL as ms.StringValue) || "7d";
    const parsedMs = ms(expiresIn);
    // Safety check: if ms() fails to parse, default to 7 days
    const expiresDuration = typeof parsedMs === "number" ? parsedMs : ms("7d");
    const expiresAt = new Date(Date.now() + expiresDuration);
    await this.sessionRepo.create({
      userId: user.id,
      refreshToken: newRefreshToken,
      deviceInfo: reqDeviceInfo,
      expiresAt,
    });
    return { user: newTokenPayload, token, refreshToken: newRefreshToken };
  }
  private async handleStatus(user: IPerson) {}
  private async handleSuccessfulLogin(user: any) {}

  private async handleFailedLogin(user: any) {}
}

// export class AuthServices {
//   constructor( private notifyService: NotifyService ) {}
//   async register(username: string, email: string, password: string) {
//     const user = await this.userRepo.findByEmail(email);
//     if (user) AppError.badRequest("User already exists");

//     const newUser = await this.userRepo.create({
//       username,
//       email,
//       password,
//       status: UserAccountStatusEnum.PENDING,
//     });

//     const verificationToken = jwtUitl.generateVerificationToken({
//       id: newUser.id,
//     });
//     const verificationLink = `${enviro.clientUrl}/auth/verify-email/${verificationToken}`;

//     // Send Verification Email
//     await this.notifyService.sendVerificationEmail(
//       email,
//       username,
//       verificationLink,
//     );
//     return newUser;
//   }

//   private async handleFailedLogin(user: any) {
//     let attempts = (user.failedLoginAttempts || 0) + 1;
//     const update: any = {
//       $set: { failedLoginAttempts: attempts },
//     };

//     // Lock account after 5 failed attempts
//     if (attempts >= 5) {
//       logger.warn(
//         `Locking account for ${user.email} after ${attempts} attempts`,
//       );
//       update.$set.status = UserAccountStatusEnum.LOCKED;
//       update.$set.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
//       update.$set.state = UserStateEnum.OFFLINE;

//       // Notify user about security lockout
//       await this.notifyService.sendAccountLockedNotification(
//         user.email,
//         user.username,
//       );
//     }

//     await user.updateOne(update);
//   }

//   private async handleSuccessfulLogin(user: any) {
//     let newStatus = user.status;

//     // Auto-reactivate if status was locked (and we reached here, meaning lockout expired) or inactive
//     if (
//       user.status === UserAccountStatusEnum.LOCKED ||
//       user.status === UserAccountStatusEnum.INACTIVE
//     ) {
//       newStatus = UserAccountStatusEnum.ACTIVE;
//     }

//     await user.updateOne({
//       $set: {
//         state: UserStateEnum.ONLINE,
//         status: newStatus,
//         activeAt: new Date(),
//         failedLoginAttempts: 0,
//         lockedUntil: null,
//       },
//       $unset: {
//         logoutAt: "",
//       },
//     });
//   }

//   async refresh(refreshToken: string, reqDeviceInfo: DeviceInfo) {
//     const payload = jwtUitl.verifyRefreshToken(refreshToken);
//     const session = await this.sessionRepo.findByToken(refreshToken);
//     if (!session)
//       AppError.unauthorized("Invalid or expired refresh token");

//     const user = await this.userRepo.findById(payload.id);
//     if (!user || user.status !== UserAccountStatusEnum.ACTIVE) {
//       AppError.unauthorized("User not found or inactive");
//     }

//     // Token Rotation Logic:
//     // 1. Delete the old session
//     await this.sessionRepo.deleteByToken(refreshToken);

//     // 2. Generate new tokens
//     const newTokenPayload: TokenPayload = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//       role: user.role ?? UserRoleEnum.USER,
//     };
//     const accessToken = jwtUitl.generateAccessToken(newTokenPayload);
//     const newRefreshToken = jwtUitl.generateRefreshToken({ id: user.id });

//     // 3. Create new session
//     const expiresIn = (env.refreshExpiresIn as ms.StringValue) || "7d";
//     const parsedMs = ms(expiresIn);

//     // Safety check: if ms() fails to parse, default to 7 days
//     const expiresDuration = typeof parsedMs === "number" ? parsedMs : ms("7d");
//     const expiresAt = new Date(Date.now() + expiresDuration);

//     await this.sessionRepo.create({
//       userId: user.id,
//       refreshToken: newRefreshToken,
//       deviceInfo: reqDeviceInfo,
//       expiresAt,
//     });

//     return { accessToken, refreshToken: newRefreshToken };
//   }

export const authService = new AuthService(
  userRepo,
  notifyService,
  sessionRepo,
);
