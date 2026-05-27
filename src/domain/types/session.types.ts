import { ObjectId } from "mongoose";

export type IDeviceInfo = {
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  engine: string;
  cpu: string;
  ip: string;
  region: string;
  city: string;
  country: string;
};
export type ISession = {
  refreshToken: string;
  userId: string | ObjectId;
  deviceInfo: IDeviceInfo;
  // createdAt: Date;
  expiresAt: Date;
};
export interface SessionRepoType {
  create(session: ISession): Promise<void>;
  findByToken(token: string): Promise<ISession | null>;
  deleteByToken(token: string): Promise<void>;
  deleteOtherSessions(userId: string, currentToken: string): Promise<void>;
}
