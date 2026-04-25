import { PersonSchemaFields } from "@/lib/schema/person.entities";
import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { PersonDto } from "@/types/user.types";
import { applySlugify, getSchemaOptions } from "@/lib/schema/fields";

const PersonSchema = new Schema<PersonDto>(
  {
    ...PersonSchemaFields,
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  getSchemaOptions("persons"),
);
applySlugify(PersonSchema, "username");

// Hash password before save
PersonSchema.pre("save", async function () {
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
PersonSchema.pre("updateOne", async function () {
  const user = this.getUpdate() as Partial<PersonDto>;
  if (user && user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(process.env.ROUND_SALT),
    );
    user.passwordChangedAt = new Date();
  }
});
PersonSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const personModel = model<PersonDto>("Person", PersonSchema);
