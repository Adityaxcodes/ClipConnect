import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("✅ MongoDB connected");

    // Start keep-alive pings after successful connection
    startKeepAlive();
  } catch (error) {
    console.error("❌ MongoDB connection failed");
    console.error(error);
    process.exit(1);
  }
};

/**
 * MongoDB Atlas Free Tier (M0) pauses clusters after 60 days of inactivity.
 * This sends a lightweight ping every 12 hours to prevent that.
 *
 * Notes:
 * - The mongoose driver handles TCP-level keepAlive internally.
 * - This ping prevents Atlas from marking the cluster as "inactive".
 * - If the server restarts (Render cold starts), a new interval is created
 *   and the old one is garbage collected — no leak.
 * - 12 hours is conservative; even weekly would suffice for the 60-day window.
 */
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

function startKeepAlive() {
  // Prevent duplicate intervals if connectDB is called multiple times
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }

  const TWELVE_HOURS = 1000 * 60 * 60 * 12;

  keepAliveInterval = setInterval(async () => {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.warn("⚠️ MongoDB not connected, skipping keep-alive ping");
        return;
      }

      await mongoose.connection.db!.admin().ping();
      console.log(`✅ MongoDB keep-alive ping successful at ${new Date().toISOString()}`);
    } catch (err) {
      console.error("❌ MongoDB keep-alive ping failed:", err);
    }
  }, TWELVE_HOURS);

  // Allow the process to exit naturally even if the interval is active
  keepAliveInterval.unref();
}

export default connectDB;