import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(
      `🚀 Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`
    );
  });
};

startServer();
