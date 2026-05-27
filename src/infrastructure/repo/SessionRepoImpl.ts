import { SessionRepoType, ISession } from "@/domain/types/session.types";
import { sessionModel } from "@/infrastructure/database/session.model";

export class SessionRepoImpl implements SessionRepoType {
  async create(session: ISession): Promise<void> {
    await sessionModel.create(session);
  }

  async findByToken(token: string): Promise<ISession | null> {
    const doc = await sessionModel.findOne({ refreshToken: token }).lean();
    if (!doc) return null;
    return {
      userId: doc.userId.toString(),
      refreshToken: doc.refreshToken,
      deviceInfo: doc.deviceInfo,
      expiresAt: doc.expiresAt,
      // createdAt: doc.createdAt,
    };
  }

  async deleteByToken(token: string): Promise<void> {
    await sessionModel.deleteOne({ refreshToken: token });
  }

  async deleteOtherSessions(
    userId: string,
    currentToken: string,
  ): Promise<void> {
    await sessionModel.deleteMany({
      userId,
      refreshToken: { $ne: currentToken },
    });
  }
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
