import {
  IPersonFields,
  PERSON_GENDER,
  PERSON_STATE,
} from "@/domain/types/person.types";
import { Schema } from "mongoose";

export const PersonDB = new Schema<IPersonFields>({
  slug: { type: String, trim: true, lowercase: true, unique: true },
  //   name: {
  //     first: { type: String, trim: true, lowercase: true, default: "" },
  //     last: { type: String, trim: true, lowercase: true, default: "" },
  //   },
  //   phone: {
  //     type: String,
  //     unique: true,
  //     sparse: true,
  //     default: null,
  //   },
  gender: {
    type: String,
    enum: { values: PERSON_GENDER, message: "{VALUE} is not supported" },
  },

  state: {
    type: String,
    enum: { values: PERSON_STATE, message: "{VALUE} is not supported" },
    default: "offline",
  },
  age: { type: Number, default: null },
  //   adult: { type: Boolean, default: false },
  image: {
    url: { type: String, trim: true, default: null },
    publicId: { type: String, trim: true, default: null },
  },
  lastLoginAt: { type: Date, default: null },
  lockedUntil: { type: Date, default: null },
  //   twoFactorEnabled: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
});
