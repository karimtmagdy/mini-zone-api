import multer from "multer";
import { AppError } from "@/shared/utils/api.error";

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(AppError.badRequest("Not an image! Please upload only images."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

export const uploadSingleImage = (fieldName: string) =>
  upload.single(fieldName);
