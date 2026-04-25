import mongoose from "mongoose";
import { logger } from "@/lib/logger";
import { enviro } from "@/lib/local.env";
// import { attachDatabasePool } from "@vercel/functions";
// import '../../scripts/sync-env-vercel'
export class Database {
  private static instance: Database;
  private constructor() {}
  public static async getInstance(): Promise<Database> {
    const { nodeEnv, dbLocal, mongoURL, dbPass } = enviro;
    if (!dbLocal) {
      throw new Error("Please add your Mongo URI to .env.local");
    }
    if (!global.__mongoose_cache) {
      global.__mongoose_cache = { conn: null, promise: null };
    }
    const cache = global.__mongoose_cache;

    const isDev = nodeEnv === "dev";

    const mongoURI = isDev
      ? mongoURL?.replace("<db_password>", String(dbPass))
      : dbLocal;
    // console.log(mongoURI)

    // Create new connection if not cached
    if (!cache.promise) {
      cache.promise = mongoose.connect(String(mongoURI), {
        bufferCommands: false, // Fail fast instead of buffering
        serverSelectionTimeoutMS: 10000, // 10s to find a server
        socketTimeoutMS: 45000, // 45s idle socket timeout
        connectTimeoutMS: 10000, // 10s to establish connection
        maxPoolSize: 10, // Limit connection pool for serverless
      });
    }
    try {
      cache.conn = await cache.promise;
      logger.log("♻️  Reusing existing MongoDB connection");
    } catch (error) {
      logger.error("❌ MongoDB connection error:", error);
      cache.promise = null; // Reset promise on failure
      throw error;
    }
    if (!Database.instance) {
      logger.log("✅☁️  MongoDB connected successfully");
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
