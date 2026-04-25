import { SchemaDefinition } from "mongoose";

export const SchemaFields: SchemaDefinition = {
  slug: { type: String, trim: true, lowercase: true, unique: true },
  deletedAt: { type: Date, select: false, default: null },
};
export const SchemaImageFields: SchemaDefinition = {
  image: { url: { type: String }, publicId: { type: String } },
};
