import { Schema, SchemaDefinition } from "mongoose";
import _slugify from "slugify";
const slugify = (_slugify as any).default || _slugify;

export const SchemaFields: SchemaDefinition = {
  slug: { type: String, trim: true, lowercase: true, unique: true },
  deletedAt: { type: Date, select: false, default: null },
};
export const SchemaImageFields: SchemaDefinition = {
  image: { url: { type: String }, publicId: { type: String } },
};

export const getSchemaOptions = (collectionName: string): any => ({
  timestamps: true,
  collection: collectionName,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(_doc: any, ret: any) {
      const safeRet = ret as Partial<typeof ret>;
      delete safeRet.__v;
      delete safeRet._id;
      return safeRet;
    },
  },
  toObject: { virtuals: true },
});

export interface ISlugable {
  name: string;
  slug: string;
}

export const applySlugMiddleware = <T extends { slug: string }>(
  schema: Schema<any>,
  sourceField: keyof T,
) => {
  // Hook for .save() and .create()
  schema.pre("save", async function (this: any) {
    if (this.isModified(sourceField as string) || !this.slug) {
      if (this[sourceField]) {
        this.slug = slugify(String(this[sourceField]), {
          lower: true,
          strict: true,
        });
      }
    }
  });

  // Hook for .findOneAndUpdate(), .updateOne(), etc.
  schema.pre(
    ["findOneAndUpdate", "updateOne", "updateMany"],
    function (this: any) {
      const update = this.getUpdate();

      // Check if the source field is being updated
      if (update[sourceField]) {
        update.slug = slugify(String(update[sourceField]), {
          lower: true,
          strict: true,
        });
      } else if (update.$set && update.$set[sourceField]) {
        // Handle cases where update is wrapped in $set
        update.$set.slug = slugify(String(update.$set[sourceField]), {
          lower: true,
          strict: true,
        });
      }
    },
  );
};

export const applySoftDeleteMiddleware = (schema: Schema) => {
  schema.pre(/^(find|count)/, function (this: any) {
    if (this.getOptions().withDeleted) {
      return;
    }
    this.where({ deletedAt: null });
  });
};
