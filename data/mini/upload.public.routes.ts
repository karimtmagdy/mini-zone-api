import { upload } from "@/config/multer";
import { Router } from "express";
import { CloudinaryService } from "@/config/cloudinary";
import { authenticate } from "@/middleware/auth.middleware";
import fs from "fs";

const router = Router();

router.use(authenticate);

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) throw new Error("Please upload an image");
    const result = await CloudinaryService.uploadSinglePhoto(
      req.file.path,
      "general"
    );
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      status: "success",
      message: "Upload successfully",
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
});

export { router as uploadPublicRouter };
