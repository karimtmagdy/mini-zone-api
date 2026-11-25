import { Schema } from "mongoose";

/** Generic { name, value } pair used for attributes and specification items. */
export interface IKeyValue {
  name: string;
  value: string;
}

/** Reusable sub-schema for a single { name, value } pair. */
export const keyValueSchema = new Schema<IKeyValue>(
  {
    name: { type: String, trim: true, required: true },
    value: { type: String, trim: true, required: true },
  },
  { _id: false },
);
