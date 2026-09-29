import { Schema } from "mongoose";

interface ApplyVirtualOptions {
  schema: Schema;
  /** The model name to reference (e.g. "Product") */
  ref: string;
  /** The field in the foreign model that holds the reference (e.g. "category") */
  foreign: string;
  /** The local field to match on — defaults to "_id" */
  localField?: string;
  /** The virtual field name on this schema — defaults to lowercase of ref + "s" (e.g. "products") */
  as?: string;
  /** The match condition for the virtual */
  // match?: Record<string, unknown>;
}

export const applyVirtual = ({
  schema,
  ref,
  foreign,
  localField = "_id",
  as,
  // match = { isArchived: false, archivedAt: null },
}: ApplyVirtualOptions): void => {
  const virtualName = as ?? `${ref.toLowerCase()}s`;

  schema.virtual(virtualName, {
    ref,
    localField,
    foreignField: foreign,

    justOne: false,
  });

  // Make virtuals appear when calling .toObject() or .toJSON()
  schema.set("toObject", { virtuals: true });
  schema.set("toJSON", { virtuals: true });
};
