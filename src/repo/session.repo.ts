import { Session } from "../models/sessions.model";
import type { SessionDto } from "@/types/session.dto";

export class SessionRepo {
  async create(data: Partial<SessionDto>) {
    return await Session.create(data);
  }
  async findByToken(refreshToken: string) {
    return await Session.findOne({ refreshToken }).exec();
  }
  async findByUserId(userId: string) {
    return await Session.find({ userId }).exec();
  }
  async deleteByToken(refreshToken: string) {
    return await Session.deleteOne({ refreshToken });
  }
  async deleteByUserId(userId: string) {
    return await Session.deleteMany({ userId });
  }
  async deleteOtherSessions(userId: string, currentToken: string) {
    return await Session.deleteMany({
      userId,
      refreshToken: { $ne: currentToken },
    });
  }
  //   async updateResetPasswordToken(
  //   email: string,
  //   token: string,
  //   expiresAt: Date,
  // ) {
  //   const user = await User.findOneAndUpdate(
  //     { email },
  //     { resetPasswordToken: token, resetPasswordExpireAt: expiresAt },
  //     { new: true },
  //   );
  //   return user;
  // }
  // async findByResetToken(token: string) {
  //   const user = await User.findOne({
  //     resetPasswordToken: token,
  //     resetPasswordExpireAt: { $gt: Date.now() },
  //   });
  //   return user;
  // }

  // async clearResetToken(userId: string) {
  //   const user = await User.findByIdAndUpdate(userId, {
  //     $unset: { resetPasswordToken: 1, resetPasswordExpireAt: 1 },
  //   });
  //   return user;
  // }
}

export const sessionRepo = new SessionRepo();
