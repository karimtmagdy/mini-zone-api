import { PersonSchemaFields } from "@/shared/schema/person.entities";
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IPerson } from "@/domain/types/person.types";
import {
  applySlugify,
  applySoftDelete,
  getSchemaOptions,
} from "@/shared/schema/fields";

const PersonSchema = new Schema<IPerson>(
  {
    ...PersonSchemaFields,
    password: {
      type: String,
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    // verifyOtp: {
    //   code: String,
    //   expiresAt: Date,
    // },
    // resetOtp: {
    //   code: String,
    //   expiresAt: Date,
    // },
    twoFactorEnabled: { type: Boolean, default: false },
    // twoFactorSecret: { type: String, select: false },
    remember: { type: Boolean, default: false },
  
  },
  {
    ...getSchemaOptions("persons"),
    discriminatorKey: "kind",
  },
);

applySlugify(PersonSchema, "username");
applySoftDelete(PersonSchema);

// Hash password before save
PersonSchema.pre("save", async function () {
  const doc = this as any;
  if (!doc.isModified("password")) return;
  doc.password = await bcrypt.hash(
    doc.password!,
    Number(process.env.ROUND_SALT || 10),
  );
  if (!doc.isNew) {
    doc.passwordChangedAt = new Date();
  }
});

// Update passwordChangedAt field when update password
PersonSchema.pre("updateOne", async function () {
  const user = this.getUpdate() as Partial<IPerson>;
  if (user && user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(process.env.ROUND_SALT || 10),
    );
    user.passwordChangedAt = new Date();
  }
});

PersonSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password || "");
};

export const personModel = model<IPerson>("Person", PersonSchema);
