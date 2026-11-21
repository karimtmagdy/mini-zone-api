import { HydratedDocument, Query, Schema, model } from "mongoose";
import { USER_ROLE, USER_STATUS } from "@/domain/types/user.types";
import { CustomerDoc } from "@/domain/dto/user.dto";
import { applySlugify } from "@/common/plugin/plugin-slugify";
import bcrypt from "bcryptjs";

// Password hashing / comparing lives only in this file.
const roundSalt = (): number => Number(process.env.ROUND_SALT || 12);

const CustomerDB = new Schema<CustomerDoc>(
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
    age: { type: Number, default: null },
    gender: { type: String, default: null },
    lockedUntil: { type: Date, default: null },
    slug: { type: String, trim: true, lowercase: true, unique: true },
    passwordChangedAt: { type: Date, default: null },
    failedLoginAttempts: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
    isArchived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date, select: false, default: null },
    // address
  },
  { timestamps: true },
);

// ===== Hash password before save =====
CustomerDB.pre("save", async function (this: HydratedDocument<CustomerDoc>) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, roundSalt());
  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
});

// ===== Hash password before update queries =====
CustomerDB.pre(
  ["updateOne", "updateMany", "findOneAndUpdate"],
  async function (this: Query<CustomerDoc, CustomerDoc>) {
    const update = this.getUpdate() as Record<string, any> | null;
    if (!update) return;

    const target =
      update.$set && typeof update.$set === "object" ? update.$set : update;
    if (!target.password) return;

    target.password = await bcrypt.hash(String(target.password), roundSalt());
    target.passwordChangedAt = new Date();
  },
);

applySlugify(CustomerDB, "username");
export const customerDB = model<CustomerDoc>("Customer", CustomerDB);

// ===== Compare a candidate password against the stored hash =====
export const verifyCustomerPassword = async (
  email: string,
  candidate: string,
): Promise<boolean> => {
  const doc = await customerDB
    .findOne({ email })
    .select("+password")
    .lean<CustomerDoc>();

  if (!doc?.password) return false;
  return bcrypt.compare(candidate, doc.password);
};
