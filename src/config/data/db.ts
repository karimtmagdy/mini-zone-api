import mongoose from "mongoose";
import { logger } from "../../lib/logger";

export class Database {
  private static instance: Database;
  private constructor() {}
  public static async getInstance(): Promise<Database> {
    if (!process.env.DB_LOCAL) {
      throw new Error("Please add your Mongo URI to .env.local");
    }
    if (!global.__mongoose_cache) {
      global.__mongoose_cache = { conn: null, promise: null };
    }
    const cache = global.__mongoose_cache;

    // Create new connection if not cached
    if (!cache.promise) {
      cache.promise = mongoose.connect(String(process.env.DB_LOCAL));
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
