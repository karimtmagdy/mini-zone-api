import { Types } from "mongoose";
import { TPermission, TUserRole } from "@/domain/types/user.types";

export interface AccessTokenPayload {
  sub: string | Types.ObjectId;
  role: TUserRole;
  permissions: TPermission[];
}
// export interface ISession extends IBaseMetaData {
//   refreshToken: string;
//   userId: Types.ObjectId;
//   // deviceInfo: IDeviceInfo;
//   expiresAt: Date;
// }
