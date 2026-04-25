import { ObjectId } from "mongoose";

export type DeviceInfo = {
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
export type SessionDto = {
  refreshToken: string;
  userId: string | ObjectId;
  deviceInfo: DeviceInfo;
  createdAt: Date;
  expiresAt: Date;
};
