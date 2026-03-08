import { z } from "zod/v4";

// export const emailRegex: RegExp =
// /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net|org)$/;

export const EmailZod = z.email("Invalid email address").toLowerCase().trim();

export const regexPhone: RegExp = /^[0-9]{11}$/;
// export const mongoIdRegex: RegExp = /^[0-9a-fA-F]{24}$/;
export const mongoIdRegex: RegExp = /^[a-f\d]{24}$/i;

export const ObjectIdZod = z
  .string({ message: "ID is required" })
  .regex(mongoIdRegex, "Invalid ObjectId format");

export const IdParamZod = z.object({ id: ObjectIdZod });
export const slugy = z.string().check(z.slugify());

export const PasswordZod = z
  .string({ message: "Password is required" })
  .min(6, "Password must be at least 6 characters")
  .max(30, "Password must be less than 30 characters");

export const MultipleBulkZod = z.object({
  ids: z
    .array(ObjectIdZod)
    .min(1, { message: "At least one ID is required" })
    .max(100, { message: "At most 100 IDs are allowed" }),
});
export const phoneZod = z
  .string()
  .length(11, "Phone number must be 11 digits")
  .startsWith("01", "Phone number must start with 01")
  .regex(regexPhone, "Invalid phone number format");
// const phoneSchema = z
//   .string()
//   .min(10, "Phone number must be at least 10 characters")
//   .max(15, "Phone number must be at most 15 characters");
export const dateZod = z.object({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime(),
});

export type DateDto = z.infer<typeof dateZod>;

// image is NOT validated here — it arrives via Multer (req.file), NOT req.body
// image: z.object({ url: z.string(), publicId: z.string() }).optional(),
export const imageZod = z.object({
  url: z.string(),
  publicId: z.string(),
});

export type ImageDto = z.infer<typeof imageZod>;
