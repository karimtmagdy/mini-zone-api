import { IDeviceInfo, ISession } from "@/domain/types/session.types";
import { Schema, Types, model } from "mongoose";

const DeviceInfoSchema = new Schema<IDeviceInfo>(
  {
    browser: {
      name: { type: String, default: "unknown" },
      version: { type: String, default: "unknown" },
    },
    os: {
      name: { type: String, default: "unknown" },
      version: { type: String, default: "unknown" },
    },
    engine: { type: String, default: "unknown" },
    cpu: { type: String, default: "unknown" },
    ip: { type: String, default: "unknown" },
    region: { type: String, default: "unknown" },
    city: { type: String, default: "unknown" },
    country: { type: String, default: "unknown" },
  },
  { _id: false },
);

const SessionSchema = new Schema<ISession>({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  refreshToken: { type: String, required: true },
  deviceInfo: { type: DeviceInfoSchema, default: {} },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL Index
  // createdAt: { type: Date, default: Date.now },
});

export const sessionModel = model<ISession>("Session", SessionSchema);
