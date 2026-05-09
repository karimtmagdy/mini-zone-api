import { v2 as cloudinary } from "cloudinary";
import { enviro } from "@/shared/lib/local.env";

cloudinary.config({
  cloud_name: enviro.cloudinaryApiCloudName,
  api_key: enviro.cloudinaryApiKey,
  api_secret: enviro.cloudinaryApiSecretKey,
});

export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};

export default cloudinary;
