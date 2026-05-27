import { PersonBaseZod } from "@/shared/schema/person.zod";
import { z } from "zod/v4";

export const updateProfileZod = PersonBaseZod.partial().pick({
  name: true,
  phone: true,
  gender: true,
  age: true,
  image: true,
});
export type UpdateUserProfile = z.infer<typeof updateProfileZod>;
