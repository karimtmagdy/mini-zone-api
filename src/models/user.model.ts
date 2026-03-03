import { Schema, model } from "mongoose";
import { IUser } from "../types/user.dto.js";
import bcrypt from "bcryptjs";
// import { slugify } from "zod/v4";
import slugify from "slugify";
import {
  USER_GENDERS,
  USER_ROLES,
  USER_STATE,
  USER_STATUS,
  UserRoleEnum,
  UserStateEnum,
} from "../types/user-role.enums.js";
import { PersonSchemaFields } from "./shard.schema.js";

const UserSchema = new Schema<IUser>(
  {
    ...PersonSchemaFields,
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [50, "Username must be at most 50 characters"],
    },
    age: { type: Number, min: [18, "Age must be at least 18"] },
    gender: { type: String, enum: USER_GENDERS },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    state: { type: String, enum: USER_STATE, default: UserStateEnum.OFFLINE },
    status: { type: String, enum: USER_STATUS, default: "active" },

    lockedUntil: { type: Date, select: false },
    failedLoginAttempts: { type: Number, default: 0, select: false },

    verifiedAt: { type: Date },
    verifyOtp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    resetOtp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    deletedAt: { type: Date, select: false },
    role: {
      type: String,
      enum: USER_ROLES,
      default: UserRoleEnum.USER,
    },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
    lastLoginAt: { type: Date },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordChangedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        const safeRet = ret as Partial<typeof ret>;
        delete safeRet.__v;
        delete safeRet._id;
        delete safeRet.password;
        return safeRet;
      },
    },
    toObject: { virtuals: true },
  },
);

// Hash password before save
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.ROUND_SALT),
  );
  // Update passwordChangedAt field
  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
});
// Update passwordChangedAt field when update password
UserSchema.pre("updateOne", async function () {
  const user = this.getUpdate() as Partial<IUser>;
  if (user && user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(process.env.ROUND_SALT),
    );
    user.passwordChangedAt = new Date();
  }
});
UserSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};
UserSchema.pre("save", function () {
  const user = this as Partial<IUser>;
  if (user && user.username) {
    user.slug = slugify(user.username);
  }
});
// Update slug when update user
UserSchema.pre("updateOne", async function () {
  const user = this.getUpdate() as Partial<IUser>;
  if (user && user.username) {
    user.slug = slugify(user.username);
  }
});
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const UserModel = model<IUser>("User", UserSchema);
