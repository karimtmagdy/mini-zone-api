import { SchemaDefinition } from "mongoose";
import { DEFAULT_USER_IMAGE } from "../types/global.types.js";

/**
 * Shared schema fields for all "Person" entities (User, Employee, etc.)
 */
export const PersonSchemaFields: SchemaDefinition = {
  name: {
    first: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [50, "First name must be at most 50 characters"],
    },
    last: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, "Last name must be at least 3 characters"],
      maxlength: [50, "Last name must be at most 50 characters"],
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: [true, "Email is required"],
    immutable: true,
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    minlength: [10, "Phone number must be at least 10 characters"],
    maxlength: [15, "Phone number must be at most 15 characters"],
  },
  image: {
    url: {
      type: String,
      trim: true,
      default: DEFAULT_USER_IMAGE,
    },
    publicId: { type: String, trim: true, default: null },
  },
};
