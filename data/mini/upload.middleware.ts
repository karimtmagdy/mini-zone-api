import { Request, Response, NextFunction } from "express";
import { upload } from "@/config/multer";

/**
 * Flexible upload middleware that handles multipart/form-data.
 * It uses upload.any() to populate req.files.
 * For convenience, if only one file is uploaded, it populates req.file.
 */
export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contentType = req.headers["content-type"];
  if (!contentType?.includes("multipart/form-data")) return next();

  upload.any()(req, res, (err) => {
    if (err) return next(err);

    // Convenience: If there's at least one file, populate req.file for single-file handlers
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      req.file = files[0];
    }

    next();
  });
};
