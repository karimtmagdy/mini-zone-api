import { z } from "zod/v4";
import { PersonBaseZod } from "@/shared/schema/person.zod";
import { ObjectIdZod } from "@/shared/schema/shard.schema";
import { queryZod } from "@/shared/schema/query.schema";
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_JOB_TITLES,
  EmployeeDepartment,
  EmployeeJobTitle,
} from "@/domain/types/employee.types";

export const createEmployeeZod = PersonBaseZod.extend({
  username: z.string().min(3).max(50),
  code: z.string().optional(),
  department: z.enum(EMPLOYEE_DEPARTMENTS),
  jobTitle: z.enum(EMPLOYEE_JOB_TITLES),
  salary: z.number().positive().optional(),
  hiredAt: z.coerce.date().optional(),
  managerId: ObjectIdZod.optional(),
  password: z.string().min(6).optional(),
});

export const updateEmployeeZod = createEmployeeZod.partial().omit({
  code: true,
  hiredAt: true,
  password: true,
});

export const employeeQueryZod = queryZod.extend({
  department: z.enum(EMPLOYEE_DEPARTMENTS).optional(),
  managerId: ObjectIdZod.optional(),
  status: z.string().optional(),
  jobTitle: z.string().optional(),
});

export type CreateEmployeeDTO = z.infer<typeof createEmployeeZod>;
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeZod>;
