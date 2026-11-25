import { z } from "zod/v4";
import {
  EMP_DEPARTMENT,
  EMP_JOBS,
  EMP_ROLE,
  EMP_STATUS,
  IEmployee,
} from "@/domain/types/employee.types";

type Omitted = z.ZodType<Partial<Omit<IEmployee, "isArchived" | "code">>>;

const objectId = z
  .string({ error: "userId is required" })
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, { error: "userId must be a valid ObjectId" });

export const CoreEmployee = z.object({
  userId: objectId,
  code: z.string().trim().min(3).max(32),
  department: z.enum(EMP_DEPARTMENT, { error: "Invalid department value" }),
  job: z.enum(EMP_JOBS, { error: "Invalid job value" }),
  jobRole: z.enum(EMP_ROLE, { error: "Invalid job role value" }),
  salary: z.number().nonnegative().default(0),
  hiredAt: z.coerce.date().optional(),
  leftAt: z.coerce.date().nullable().optional(),
  status: z
    .enum(EMP_STATUS, { error: "Invalid status value" })
    .default("pending"),
  isArchived: z.boolean().default(false),
  archivedAt: z.date().nullable(),
}) satisfies Omitted;

export const createEmployee = CoreEmployee.pick({
  userId: true,
  department: true,
  job: true,
  jobRole: true,
  salary: true,
  hiredAt: true,
  status: true,
}).partial({ salary: true, hiredAt: true, status: true });

export const bootstrapAdmin = CoreEmployee.pick({
  department: true,
  job: true,
  salary: true,
  hiredAt: true,
}).partial({ salary: true, hiredAt: true }).extend({
  jobRole: z.literal("admin").default("admin"),
});

/** Create login account + employee profile in one request. */
export const hireEmployee = z.object({
  username: z
    .string({ error: "username is required" })
    .trim()
    .min(3)
    .max(50),
  email: z.email({ error: "invalid email" }).trim().toLowerCase(),
  password: z
    .string({ error: "password is required" })
    .min(6)
    .max(30),
  department: z.enum(EMP_DEPARTMENT, { error: "Invalid department value" }),
  job: z.enum(EMP_JOBS, { error: "Invalid job value" }),
  jobRole: z.enum(EMP_ROLE, { error: "Invalid job role value" }),
  salary: z.number().nonnegative().default(0),
  status: z
    .enum(EMP_STATUS, { error: "Invalid status value" })
    .default("active"),
});

export const updateEmployee = CoreEmployee.pick({
  department: true,
  job: true,
  jobRole: true,
  salary: true,
  hiredAt: true,
  leftAt: true,
  status: true,
}).partial();

export const updateEmployeeStatus = CoreEmployee.pick({ status: true });

export type TCreateEmployeeEX = z.infer<typeof createEmployee>;
export type TBootstrapAdminEX = z.infer<typeof bootstrapAdmin>;
export type THireEmployeeEX = z.infer<typeof hireEmployee>;
export type TUpdateEmployeeEX = z.infer<typeof updateEmployee>;
export type TUpdateEmployeeStatusEX = z.infer<typeof updateEmployeeStatus>;
