import { uploadCloudinary } from "@/config/cloudinary-config";

export const uploadFile = async (imageBuffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    const uploadStream = uploadCloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(imageBuffer);
  });
};

export const deleteImage = async (publicId: string) => {
  return new Promise((resolve, reject) => {
    uploadCloudinary.uploader.destroy(publicId, (error: any, result: any) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
export const uploadImage = async (
  filePath: string,
  folder: string = "uploads",
) => {
  try {
    const result = await uploadCloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    //   logger.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
export const uploadMultipleImages = async (
  filePaths: string[],
  folder: string = "uploads",
) => {
  try {
    if (!filePaths || filePaths.length === 0) return [];
    const uploadPromises = filePaths.map((path) => uploadImage(path, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    //   logger.error("Cloudinary Bulk Upload Error:", error);
    throw error;
  }
};
export const deleteMultiplePhotos = async (publicIds: string[]) => {
  try {
    if (!publicIds || publicIds.length === 0) return [];
    const deletePromises = publicIds.map((id) => deleteImage(id));
    return await Promise.all(deletePromises);
  } catch (error) {
    //   logger.error("Cloudinary Bulk Delete Error:", error);
    throw error;
  }
};
