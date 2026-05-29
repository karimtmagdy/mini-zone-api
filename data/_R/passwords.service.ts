import { AppError } from "@/shared/utils/api.error";
import { enviro } from "@/shared/lib/local.env";
import { jwtUitl } from "@/shared/lib/jwt.lib";
import { SessionRepo, sessionRepo } from "@/_R/session.repo";
import { UserRepo, userRepo } from "@/_R/user.repo";

export class PasswordServices {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly sessionRepo: SessionRepo,
  ) {}

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user) AppError.unauthorized("User not found");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) AppError.unauthorized("Invalid credentials");
    user.password = newPassword;
    await user.save();
    return { user };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) AppError.notFound("User not found");

    //     // 1. Generate OTP (One-Shot)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp = {
      code: otp,
      expiresAt,
    };

    //     // 2. Generate JWT Link (Standard)
    const resetToken = jwtUitl.generate.resetToken({ id: user.id });
    const resetLink = `${enviro.clientUrl}/auth/reset-password/${resetToken}`;

    await user.save();

    //     await this.notifyService.sendPasswordResetEmail(
    //       user.email,
    //       user.username,
    //       otp,
    //       resetLink,
    //     );

    return { message: "Password reset instructions sent to your email" };
  }

  async resetPassword(
    newPassword: string,
    email?: string,
    otp?: string,
    token?: string,
  ) {
    let user;
    if (token) {
      // Logic A: Standard JWT Link
      const payload = jwtUitl.verification.resetToken(token);
      user = await this.userRepo.findById(payload.id);
    } else if (email && otp) {
      // Logic B: Strict One-Shot OTP
      user = await this.userRepo.findByEmail(email);
      if (!user) AppError.notFound("User not found");
      if (!user.resetOtp || !user.resetOtp.code) {
        AppError.badRequest("No active reset request found");
      }
      if (user.resetOtp.expiresAt < new Date()) {
        user.resetOtp = null;
        await user.save();
        AppError.badRequest("Reset code has expired");
      }
      const isMatch = user.resetOtp.code === otp;
      if (!isMatch) {
        AppError.badRequest("Invalid reset code.");
      }
    } else {
      AppError.badRequest("Reset token or OTP is required");
    }
    if (!user) AppError.unauthorized("User not found");
    //     // Success logic for both paths
    user.password = newPassword;
    user.resetOtp = null; // Clear OTP if it was used or existed
    await user.save();
    await this.sessionRepo.deleteByUserId(user.id);
    //     await this.notifyService.sendPasswordChangedConfirmation(user.email);
    return { message: "Password updated successfully" };
  }
}
export const passService = new PasswordServices(userRepo, sessionRepo);
