import { Schema, SchemaDefinition } from "mongoose";

export const SchemaFields: SchemaDefinition = {
  slug: { type: String, trim: true, lowercase: true, unique: true },
  deletedAt: { type: Date, select: false, default: null },
};

const ImageSchema = new Schema(
  {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
  },
  { _id: false },
);

export const SchemaImageFields: SchemaDefinition = {
  image: { type: ImageSchema, default: null },
};
