import mongoose from "mongoose";
import "dotenv/config";
import "@/infrastructure/database/models";
import { Database } from "@/infrastructure/config/data/db";
import { logger } from "@/shared/lib/logger";
import { app } from "@/index";
// import { injectSpeedInsights } from "@vercel/speed-insights";
void (async () => {
  try {
    // 1. ensure database is connected
    await Database.getInstance();

    // Seeding test brands on startup in development
    // if (process.env.NODE_ENV === "development") {
    //   try {
    //     const { brandModel } =
    //       await import("@/infrastructure/database/brand.model");
    //     await brandModel.deleteMany({ name: /^brand-/ });
    //     await brandModel.insertMany(
    //       Array.from({ length: 400 }, (_, i) => ({
    //         name: `brand-${i}`,
    //         slug: `brand-${i}`,
    //         status: "onboarding",
    //       })),
    //       { ordered: false },
    //     );
    //     logger.log("✅ 400 test brands seeded successfully on startup!");
    //   } catch (err) {
    //     logger.error("⚠️ Error seeding test brands on startup:", err);
    //   }
    // }

    // 2. start the server after db is ready
    app.listen(process.env.PORT, () => {
      logger.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
    // Start cron jobs for automated cleanup tasks
    // startCronJobs();
  } catch (error) {
    logger.error("🔥 Failed to start server:", error);
    process.exit(1);
  }
})();

process.on("uncaughtException", (error) => {
  logger.log("👋 Uncaught Exception: ", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.log("👋 Unhandled Rejection: ", reason);
  process.exit(1);
});
process.on("EADDRINUSE", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    logger.log("Port is already in use");
    process.exit(1);
  }
});
const gracefulShutdown = async (signal: string) => {
  logger.log(`👋 Received ${signal}. Shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    logger.log("✅ MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    logger.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2")); // nodemon restart signal

process.on("exit", (code: number) => {
  if (code === 0) {
    logger.log(`👋 Server is shutting down with code ${code}`);
  }
});
