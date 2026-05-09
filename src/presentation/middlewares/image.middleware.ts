import { Request, Response, NextFunction } from "express";
import cloudinary from "@/infrastructure/config/cloudinary";
import { catchError } from "@/shared/lib/catch.error";

export const uploadToCloudinary = (folder: string) =>
  catchError(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.file) return next();

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `mini-zone/${folder}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(req.file!.buffer);
    });

    const res = result as any;
    console.log("☁️ CLOUDINARY FULL RESULT:", JSON.stringify(res, null, 2));

    // Ensure we capture the URL and publicId regardless of the naming convention
    req.body.image = {
      url: res.secure_url || res.url || null,
      publicId: res.public_id || res.publicId || null,
    };

    console.log("📸 ATTACHING TO BODY:", req.body.image);

    next();
  });
