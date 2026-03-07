import { z } from "zod/v4";
import { ObjectIdZod, PasswordZod } from "./rules/shard.schema.js";
import { PersonBaseZod } from "./rules/person.schema.js";
import { queryZod } from "./rules/query.schema.js";
import { UserRoleEnum } from "../unity/enums/user-enums.js";

export const createUserZod = PersonBaseZod.pick({
  username: true,
  role: true,
}).extend({
  password: PasswordZod,
  employee: ObjectIdZod.describe(
    "The ID of the Employee to link this User account to",
  ),
});

export const updateUserZod = createUserZod.partial().omit({
  password: true,
  employee: true,
});

export const deleteUserZod = z.object({
  password: PasswordZod.describe("Password is required to confirm deletion"),
});

export const deactivateUserZod = z.object({
  password: PasswordZod.describe(
    "Password is required to confirm deactivation",
  ),
});

export const UserQueryZod = queryZod.passthrough();

export const AssignRoleZod = PersonBaseZod.pick({ role: true }).required();

export const RoleParamZod = z.object({
  role: z.nativeEnum(UserRoleEnum, {
    message: "Role is required and must be a valid specified option",
  }),
});
