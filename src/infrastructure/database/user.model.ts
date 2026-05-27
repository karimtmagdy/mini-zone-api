import { Schema } from "mongoose";
import { personModel } from "./person.model";
import { IUser } from "@/domain/types/user.types";

const UserSchema = new Schema<IUser>({
  // employeeId: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
});

export const userModel = personModel.discriminator<IUser>(
  "User",
  UserSchema,
);
