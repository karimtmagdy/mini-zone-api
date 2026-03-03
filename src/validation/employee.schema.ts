import { z } from "zod/v4";
import { ObjectIdZod } from "./shard.schema.js";
import { PersonBaseZod } from "./user.schema.js";

export const CreateEmployeeSchema = PersonBaseZod.pick({
  name: true,
  email: true,
  phone: true,
}).extend({
  department: z.string().min(1).max(100),
  jobTitle: z.string().min(1).max(100),
  salary: z.number().positive().optional(),
  hiredAt: z.coerce.date().optional(),
  managerId: ObjectIdZod.optional(),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export const EmployeeQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  department: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>;
export type EmployeeQueryDTO = z.infer<typeof EmployeeQuerySchema>;
