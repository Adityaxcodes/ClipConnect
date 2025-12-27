import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import gigRoutes from "./controllers/gig.routes";
import applicationRoutes from "./controllers/application.routes";

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

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    environment: env.nodeEnv,
  });
});

export default app;
