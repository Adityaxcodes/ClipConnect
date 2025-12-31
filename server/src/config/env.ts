import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/clipconnect",

  jwtSecret: (process.env.JWT_SECRET || "fallback_secret") as string,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || "7d") as string,

  clientUrl: process.env.CLIENT_URL || "http://localhost:5174",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880"), // 5MB default
};