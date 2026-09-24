import { Schema } from "mongoose";
import slugify from "slugify";

export const applySlugify = <T extends { slug?: string }>(
  schema: Schema<T>,
  field: keyof T,
) => {
  // Hook for .save() and .create()
  schema.pre("save", async function (this: any) {
    if (this.isModified(field as string) || !this.slug) {
      if (this[field]) {
        const input = String(this[field]);
        let slug = slugify(input, { lower: true, strict: true });
        if (!slug && input) {
          slug = input
            .trim()
            .toLowerCase()
            .replace(/[\s\W_]+/g, "-");
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
      if (update[field]) {
        const input = String(update[field]);
        let slug = slugify(input, { lower: true, strict: true });
        if (!slug && input) {
          slug = input
            .trim()
            .toLowerCase()
            .replace(/[\s\W_]+/g, "-");
        }
        update.slug = slug;
      } else if (update.$set && update.$set[field]) {
        const input = String(update.$set[field]);
        let slug = slugify(input, { lower: true, strict: true });
        if (!slug && input) {
          slug = input
            .trim()
            .toLowerCase()
            .replace(/[\s\W_]+/g, "-");
        }
        update.$set.slug = slug;
      }
    },
  );
};
