import {
  EMP_DEPARTMENT,
  EMP_JOBS,
  EMP_ROLE,
  EMP_STATUS,
} from "@/domain/types/employee.types";
import { EmployeeDoc } from "@/domain/dto/employee.dto";
import { archiveFields } from "@/infra/db/fields/archive.field";
import { Schema, Types, model } from "mongoose";

const EmployeeDB = new Schema<EmployeeDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true,
      index: true,
    },
    code: { type: String, required: true, unique: true, index: true },
    salary: { type: Number, default: 0, min: 0 },
    hiredAt: { type: Date, default: Date.now },
    leftAt: { type: Date, default: null },
    department: {
      type: String,
      required: true,
      enum: { values: EMP_DEPARTMENT, message: "{VALUE} is not supported" },
    },
    job: {
      type: String,
      required: true,
      enum: { values: EMP_JOBS, message: "{VALUE} is not supported" },
    },
    jobRole: {
      type: String,
      required: true,
      enum: { values: EMP_ROLE, message: "{VALUE} is not supported" },
      index: true,
    },
    status: {
      type: String,
      enum: { values: EMP_STATUS, message: "{VALUE} is not supported" },
      default: "pending",
      index: true,
    },
    ...archiveFields,
  },
  { timestamps: true },
);

EmployeeDB.index({ department: 1, jobRole: 1 });

export const employeeDB = model<EmployeeDoc>("Employee", EmployeeDB);

export type EmployeeObjectId = Types.ObjectId;
