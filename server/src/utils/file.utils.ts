/**
 * Convert buffer to base64 data URI for Cloudinary upload
 * @param buffer - File buffer from multer
 * @param mimetype - File mimetype
 * @returns Base64 data URI string
 */
export const bufferToDataURI = (buffer: Buffer, mimetype: string): string => {
  const base64 = buffer.toString("base64");
  return `data:${mimetype};base64,${base64}`;
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID
 */
export const extractPublicId = (url: string): string => {
  const parts = url.split("/");
  const fileWithExtension = parts[parts.length - 1];
  const publicId = fileWithExtension.split(".")[0];
  
  // Get folder path if exists
  const folderIndex = parts.indexOf("upload") + 1;
  if (folderIndex < parts.length - 1) {
    const folderPath = parts.slice(folderIndex + 1, -1).join("/");
    return folderPath ? `${folderPath}/${publicId}` : publicId;
  }
  
  return publicId;
};

/**
 * Validate file size
 * @param size - File size in bytes
 * @param maxSize - Maximum allowed size in bytes
 * @returns Boolean indicating if file size is valid
 */
export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};

/**
 * Format file size to readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
