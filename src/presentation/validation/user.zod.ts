import { z } from "zod/v4";
import { PersonBaseZod } from "@/shared/schema/person.zod"; // Note: might need adjusting if person.schema moved
import { ObjectIdZod, PasswordZod } from "@/shared/schema/shard.schema";
import { queryZod } from "@/shared/schema/query.schema";

export const createUserZod = PersonBaseZod.extend({
  username: z.string().min(3).max(50),
  password: PasswordZod,
  employeeId: ObjectIdZod.optional(),
});

export const updateUserZod = createUserZod.partial().omit({
  password: true,
  employeeId: true,
});

export const userQueryZod = queryZod.extend({
  employeeId: ObjectIdZod.optional(),
  status: z.string().optional(),
  role: z.string().optional(),
});

export const changeRoleZod = PersonBaseZod.pick({ role: true }).required();
// AssignRoleZod
export const deleteUserZod = z.object({
  password: PasswordZod.describe("Password is required to confirm deletion"),
});

export const deactivateUserZod = z.object({
  password: PasswordZod.describe(
    "Password is required to confirm deactivation",
  ),
});
export type CreateUserDTO = z.infer<typeof createUserZod>;
export type UpdateUserDTO = z.infer<typeof updateUserZod>;
export type ChangeRoleDTO = z.infer<typeof changeRoleZod>;
export type DeleteUserDTO = z.infer<typeof deleteUserZod>;
export type DeactivateUserDTO = z.infer<typeof deactivateUserZod>;
export type UserQueryDTO = z.infer<typeof userQueryZod>;
export const updateStatusZod = PersonBaseZod.pick({ status: true }).required();
export const bulkIdsZod = z.object({
  ids: z.array(ObjectIdZod).min(1, "At least one ID is required"),
});

// export const createUserZod = PersonBaseZod.pick({
//   username: true,
//   role: true,
// }).extend({
//   password: PasswordZod,
//   employee: ObjectIdZod.describe(
//     "The ID of the Employee to link this User account to",
//   ),
// });
