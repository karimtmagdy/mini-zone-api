import { Schema, model } from "mongoose";
import { IEmployee } from "../types/employee.types.js";
import { PersonSchemaFields } from "./shard.schema.js";

const EmployeeSchema = new Schema<IEmployee>(
  {
    ...PersonSchemaFields,
    code: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    jobTitle: { type: String, required: true },
    salary: { type: Number },
    hiredAt: { type: Date, default: Date.now },
    managerId: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  {
    timestamps: true,
    collection: "employees",
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc: unknown, ret: Record<string, any>) {
        const safeRet = ret;
        delete safeRet.__v;
        delete safeRet._id;
        return safeRet;
      },
    },
    toObject: { virtuals: true },
  },
);

EmployeeSchema.index({ department: 1 });

export const EmployeeModel = model<IEmployee>("Employee", EmployeeSchema);
