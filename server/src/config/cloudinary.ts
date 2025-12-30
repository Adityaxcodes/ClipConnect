import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

export default cloudinary;

/**
 * Upload image to Cloudinary
 * @param file - File path or base64 data URI string
 * @param folder - Folder name in Cloudinary (optional)
 * @returns Upload result with secure_url
 */
export const uploadImage = async (
  file: string,
  folder: string = "clipconnect"
) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 */
export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
};

/**
 * Upload video to Cloudinary
 * @param file - File path or base64 data URI string
 * @param folder - Folder name in Cloudinary (optional)
 * @returns Upload result with secure_url
 */
export const uploadVideo = async (
  file: string,
  folder: string = "clipconnect/videos"
) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "video",
      transformation: [
        { width: 1920, height: 1080, crop: "limit" },
        { quality: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration,
    };
  } catch (error) {
    console.error("Cloudinary video upload error:", error);
    throw new Error("Failed to upload video");
  }
};
