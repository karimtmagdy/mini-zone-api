import { Schema } from "mongoose";
import slugify from "slugify";

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

export const applySlugify = <T extends { slug: string }>(
  schema: Schema<T>,
  sourceField: keyof T,
) => {
  // Hook for .save() and .create()
  schema.pre("save", async function (this: any) {
    if (this.isModified(sourceField as string) || !this.slug) {
      if (this[sourceField]) {
        const input = String(this[sourceField]);
        let slug = slugify(input, { lower: true, strict: true });
        if (!slug && input) {
          slug = input.trim().toLowerCase().replace(/[\s\W_]+/g, "-");
        }
        this.slug = slug;
      }
    }
  });

  // Hook for .findOneAndUpdate(), .updateOne(), etc.
  schema.pre(
    ["findOneAndUpdate", "updateOne", "updateMany"],
    function (this: any) {
      const update = this.getUpdate();
      if (update[sourceField]) {
        const input = String(update[sourceField]);
        let slug = slugify(input, { lower: true, strict: true });
        if (!slug && input) {
          slug = input.trim().toLowerCase().replace(/[\s\W_]+/g, "-");
        }
        update.slug = slug;
      } else if (update.$set && update.$set[sourceField]) {
        const input = String(update.$set[sourceField]);
        let slug = slugify(input, { lower: true, strict: true });
        if (!slug && input) {
          slug = input.trim().toLowerCase().replace(/[\s\W_]+/g, "-");
        }
        update.$set.slug = slug;
      }
    },
  );
};

export const applySoftDelete = (schema: Schema) => {
  schema.pre(/^find/, function (this: any) {
    // If the query has the 'withDeleted' option, skip the filter
    if (this.getOptions().withDeleted) {
      return;
    }
    this.where({ deletedAt: null });
  });
};
interface VirtualType {
  schema: Schema;
  collection: string;
  ref: string;
}
export const applyVirtual = ({ schema, collection, ref }: VirtualType) => {
  schema.virtual("products", {
    ref: ref,
    localField: "id",
    foreignField: collection,
    count: true,
  });
};
