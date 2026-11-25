import { SchemaTypeOptions } from "mongoose";

/** Reusable slug field definition shared across schemas. */
export const slugField: SchemaTypeOptions<string> = {
  type: String,
  trim: true,
  lowercase: true,
  unique: true,
};
