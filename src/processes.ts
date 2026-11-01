import mongoose from "mongoose";
import { logger } from "@/common/lib/logger";

process.on("uncaughtException", (error) => {
  logger.log("Uncaught Exception: ", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.log("Unhandled Rejection: ", reason);
  process.exit(1);
});
process.on("EADDRINUSE", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    logger.log("Port is already in use");
    process.exit(1);
  }
});
const gracefulShutdown = async (signal: string) => {
  logger.log(`Received ${signal}. Shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    logger.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    logger.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
// nodemon restart signal
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2"));

process.on("exit", (code: number) => {
  if (code === 0) {
    logger.log(`shutdown server with code ${code}`);
  }
});
