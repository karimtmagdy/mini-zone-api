import { Schema, model } from "mongoose";
import {
  USER_ROLE,
  USER_STATUS,
} from "@/domain/types/user.types";
import { UserDoc } from "@/domain/dto/user.dto";
import { applySlugify } from "@/common/plugin/plugin-slugify";

const UserDB = new Schema<UserDoc>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: [3, "username must be at least 3 characters"],
      maxlength: [50, "username must be at most 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      required: [true, "email is required"],
      immutable: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: { values: USER_ROLE, message: "{VALUE} is not supported" },
      default: "customer",
    },
    permissions: { type: [String], default: [] },
    status: {
      type: String,
      enum: { values: USER_STATUS, message: "{VALUE} is not supported" },
      default: "active",
      index: true,
    },
    slug: { type: String, trim: true, lowercase: true, unique: true },
    passwordChangedAt: { type: Date, default: null },
    isArchived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date, select: false, default: null },
  },
  { timestamps: true },
);

applySlugify(UserDB, "username");
export const userDB = model<UserDoc>("User", UserDB);
