import multer from "multer";
import { Request } from "express";
import { env } from "../config/env";

// Configure storage to use memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter to accept only images and videos
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  }
  // Accept videos
  else if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  }
  // Reject other files
  else {
    cb(new Error("Only image and video files are allowed!"));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSize, // Limit from env (default 5MB)
  },
});

// Middleware for single file upload
export const uploadSingle = upload.single("file");

// Middleware for multiple files upload
export const uploadMultiple = upload.array("files", 10); // Max 10 files

// Middleware for image upload only
export const uploadImage = multer({
  storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
  limits: {
    fileSize: env.maxFileSize,
  },
}).single("image");

// Middleware for video upload only
export const uploadVideo = multer({
  storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"));
    }
  },
  limits: {
    fileSize: env.maxFileSize * 20, // 100MB for videos
  },
}).single("video");
