import { SchemaDefinition } from "mongoose";
import { USER_ROLES, UserRoleEnum } from "@/domain/types/user.types";
import {
  PERSON_GENDERS,
  PERSON_STATE,
  PERSON_STATUS,
  PErsonStateEnum,
  PersonStatusEnum,
} from "@/domain/types/person.types";
import { DEFAULT_USER_IMAGE } from "@/_R/global.dto";

export const PersonSchemaFields: SchemaDefinition = {
  username: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [50, "Username must be at most 50 characters"],
  },
  name: {
    first: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [50, "First name must be at most 50 characters"],
    },
    last: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [50, "Last name must be at most 50 characters"],
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Email is required"],
    immutable: true,
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    minlength: [10, "Phone number must be at least 10 characters"],
    maxlength: [15, "Phone number must be at most 15 characters"],
  },
  image: {
    url: {
      type: String,
      trim: true,
      default: DEFAULT_USER_IMAGE,
    },
    publicId: { type: String, trim: true, default: null },
  },
  age: { type: Number, min: [18, "Age must be at least 18"] },
  gender: { type: String, enum: PERSON_GENDERS },
  status: {
    type: String,
    enum: PERSON_STATUS,
    default: PersonStatusEnum.ACTIVE,
  },
  role: { type: String, enum: USER_ROLES, default: UserRoleEnum.USER },
  // Account State & Security
  state: { type: String, enum: PERSON_STATE, default: PErsonStateEnum.OFFLINE },
  lastLoginAt: { type: Date },
  passwordChangedAt: { type: Date },

  // Security & Verification
  lockedUntil: { type: Date, select: false },
  failedLoginAttempts: { type: Number, default: 0, select: false },
  verifiedAt: { type: Date },
};
