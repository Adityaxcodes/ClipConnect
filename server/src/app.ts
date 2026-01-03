import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import gigRoutes from "./controllers/gig.routes";
import applicationRoutes from "./controllers/application.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      // List of allowed origins
      const allowedOrigins = [
        env.clientUrl,
        "http://localhost:5173",
        "http://localhost:5174"
      ];
      
      // Check if origin is in allowed list or is a Vercel deployment
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Increase payload limit to handle base64 encoded videos (up to 150MB)
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/health", (_req: Request, res: Response) => {
  console.log("✅ Health check endpoint accessed");
  res.status(200).json({
    status: "OK",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: env.nodeEnv === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;