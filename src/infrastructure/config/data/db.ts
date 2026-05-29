import mongoose from "mongoose";
import { logger } from "@/shared/lib/logger";

// Correct type: Mongoose instance, not the full module namespace.
interface MongooseCache {
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: MongooseCache | undefined;
}
function getMongoURI(): string {
  const isProduction = process.env.NODE_ENV === "production";
  // const isProduction = process.env.VERCEL === "1";
  const uri = isProduction
    ? process.env.mack_MONGODB_URI
    : process.env.DB_LOCAL;
  if (!uri) {
    throw new Error(
      `Missing MongoDB URI for ${
        isProduction ? "production" : "development"
      } environment`,
    );
  }
  console.log({
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV,
    URI: process.env.mack_MONGODB_URI,
    LOCAL: process.env.DB_LOCAL,
  });
  logger.log({
    NODE_ENV: process.env.NODE_ENV,
    URI: process.env.mack_MONGODB_URI ? "EXISTS" : "MISSING",
  });
  return uri;
}

function getCache(): MongooseCache {
  if (!global.__mongoose_cache) {
    global.__mongoose_cache = { promise: null };
  }
  return global.__mongoose_cache;
}

export async function connectDB(): Promise<void> {
  // If Mongoose already has an open connection, reuse it.
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const cache = getCache();

  if (!cache.promise) {
    const uri = getMongoURI();

    //  if (process.env.NODE_ENV === "development") {
    //     mongoose.set("debug", true);
    //   }

    logger.log("🔌 Initiating MongoDB connection...");

    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      connectTimeoutMS: 10_000,
    });
  }

  try {
    await cache.promise;
    logger.log("✅ MongoDB connected successfully");
  } catch (error) {
    cache.promise = null;
    logger.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}
