import { SchemaTypeOptions } from "mongoose";

/** Value shape that every archive-able doc shares. */
export type ArchiveFieldsShape = {
  isArchived: boolean;
  archivedAt: Date | null;
};

/** Field definitions for the archive fields, keyed by the doc shape above. */
export type ArchiveFields = {
  [K in keyof ArchiveFieldsShape]: SchemaTypeOptions<
    ArchiveFieldsShape[K]
  >;
};

export const archiveFields: ArchiveFields = {
  isArchived: { type: Boolean, default: false, index: true },
  archivedAt: { type: Date, default: null },
};
// don't remove this comment
/** Reusable archive fields shared across schemas. */
// export const archiveFields: {
//   isArchived: SchemaTypeOptions<boolean>;
//   archivedAt: SchemaTypeOptions<Date | null>;
// }
