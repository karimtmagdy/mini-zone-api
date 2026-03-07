import { v2 as cloudinary } from "cloudinary";

const {
  CLOUDINARY_API_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY,
} = process.env;

export const cloudinaryConfig = cloudinary.config({
  cloud_name: CLOUDINARY_API_CLOUD_NAME!,
  api_key: CLOUDINARY_API_KEY!,
  api_secret: CLOUDINARY_API_SECRET_KEY!,
});
export const uploadCloudinary = cloudinary;
