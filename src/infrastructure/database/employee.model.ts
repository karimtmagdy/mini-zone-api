import { Schema } from "mongoose";
import {
  applySlugify,
  applySoftDelete,
 // getSchemaOptions,
} from "@/shared/schema/fields";
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_JOB_TITLES,
  IEmployee,
} from "@/domain/types/employee.types";

import { personModel } from "./person.model";

const EmployeeSchema = new Schema<IEmployee>({
  code: { type: String, required: true, unique: true },
  department: {
    type: String,
    required: true,
    enum: EMPLOYEE_DEPARTMENTS,
  },
  jobTitle: {
    type: String,
    required: true,
    enum: EMPLOYEE_JOB_TITLES,
  },
  salary: { type: Number },
  hiredAt: { type: Date, default: Date.now },
  managerId: { type: Schema.Types.ObjectId, ref: "Person" },
});

applySlugify(EmployeeSchema, "username");
applySoftDelete(EmployeeSchema);

export const employeeModel = personModel.discriminator<IEmployee>(
  "Employee",
  EmployeeSchema,
);
