import { Request, Response } from "express";
import { uploadImage, uploadVideo, deleteImage } from "../config/cloudinary";
import { bufferToDataURI, formatFileSize } from "../utils/file.utils";

/**
 * Upload image to Cloudinary
 * @route POST /api/upload/image
 * @access Private
 */
export const uploadImageHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to data URI
    const dataURI = bufferToDataURI(req.file.buffer, req.file.mimetype);

    // Upload to Cloudinary
    const result = await uploadImage(dataURI, "clipconnect/images");

    return res.status(200).json({
      message: "Image uploaded successfully",
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        size: formatFileSize(req.file.size),
      },
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

/**
 * Upload video to Cloudinary
 * @route POST /api/upload/video
 * @access Private
 */
export const uploadVideoHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to data URI
    const dataURI = bufferToDataURI(req.file.buffer, req.file.mimetype);

    // Upload to Cloudinary
    const result = await uploadVideo(dataURI, "clipconnect/videos");

    return res.status(200).json({
      message: "Video uploaded successfully",
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        duration: result.duration,
        size: formatFileSize(req.file.size),
      },
    });
  } catch (error: any) {
    console.error("Video upload error:", error);
    return res.status(500).json({
      message: "Failed to upload video",
      error: error.message,
    });
  }
};

/**
 * Upload any file (image or video) to Cloudinary
 * @route POST /api/upload/file
 * @access Private
 */
export const uploadFileHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to data URI
    const dataURI = bufferToDataURI(req.file.buffer, req.file.mimetype);

    // Determine if it's an image or video
    const isVideo = req.file.mimetype.startsWith("video/");
    const folder = isVideo ? "clipconnect/videos" : "clipconnect/images";

    // Upload to Cloudinary
    const result = isVideo
      ? await uploadVideo(dataURI, folder)
      : await uploadImage(dataURI, folder);

    return res.status(200).json({
      message: `${isVideo ? "Video" : "Image"} uploaded successfully`,
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        size: formatFileSize(req.file.size),
        ...(isVideo && { duration: (result as any).duration }),
      },
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return res.status(500).json({
      message: "Failed to upload file",
      error: error.message,
    });
  }
};

/**
 * Delete file from Cloudinary
 * @route DELETE /api/upload/:publicId
 * @access Private
 */
export const deleteFileHandler = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ message: "Public ID is required" });
    }

    // Decode the publicId (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    await deleteImage(decodedPublicId);

    return res.status(200).json({
      message: "File deleted successfully",
    });
  } catch (error: any) {
    console.error("File delete error:", error);
    return res.status(500).json({
      message: "Failed to delete file",
      error: error.message,
    });
  }
};
