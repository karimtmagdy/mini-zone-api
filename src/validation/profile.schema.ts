import { PersonBaseZod } from "./rules/person.schema.js";

export const UpdateProfileZod = PersonBaseZod.partial().pick({
  name: true,
  phone: true,
  gender: true,
  age: true,
  image: true,
});
