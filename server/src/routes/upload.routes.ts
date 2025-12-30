import { Router } from "express";
import {
  uploadImageHandler,
  uploadVideoHandler,
  uploadFileHandler,
  deleteFileHandler,
} from "../controllers/upload.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  uploadImage,
  uploadVideo,
  uploadSingle,
} from "../middleware/upload.middleware";

const router = Router();

// All upload routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/upload/image
 * @desc    Upload image to Cloudinary
 * @access  Private
 */
router.post("/image", uploadImage, uploadImageHandler);

/**
 * @route   POST /api/upload/video
 * @desc    Upload video to Cloudinary
 * @access  Private
 */
router.post("/video", uploadVideo, uploadVideoHandler);

/**
 * @route   POST /api/upload/file
 * @desc    Upload any file (image or video) to Cloudinary
 * @access  Private
 */
router.post("/file", uploadSingle, uploadFileHandler);

/**
 * @route   DELETE /api/upload/:publicId
 * @desc    Delete file from Cloudinary
 * @access  Private
 */
router.delete("/:publicId", deleteFileHandler);

export default router;
