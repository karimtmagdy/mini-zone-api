import {
  EMP_DEPARTMENT,
  EMP_JOBS,
  EMP_ROLE,
  EMP_STATUS,
} from "@/domain/types/employee.types";
import { Schema, model } from "mongoose";
const EmployeeDB = new Schema(
  {
    code: { type: String, required: true, unique: true },
    salary: { type: Number },
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
    role: {
      type: String,
      required: true,
      enum: { values: EMP_ROLE, message: "{VALUE} is not supported" },
    },
    status: {
      type: String,
      enum: { values: EMP_STATUS, message: "{VALUE} is not supported" },
      default: "inactive",
      index: true,
    },
  },
  { timestamps: true },
);
EmployeeDB.index({ name: "text" });
export const employeeDB = model("Employee", EmployeeDB);
