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
    origin: [
      env.clientUrl,
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true,
  })
);

// Increase payload limit to handle base64 encoded videos (up to 150MB)
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    environment: env.nodeEnv,
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