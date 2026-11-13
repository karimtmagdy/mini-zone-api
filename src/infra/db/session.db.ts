import { Schema, model } from "mongoose";
import { SessionDoc } from "@/domain/dto/session.dto";

const SessionDB = new Schema<SessionDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // TTL index: MongoDB removes the session once it expires.
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    revokedAt: { type: Date, default: null, index: true },
    replacedByHash: { type: String, default: null },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true },
);

export const sessionDB = model<SessionDoc>("Session", SessionDB);
