import mongoose from "mongoose";
import { logger } from "@/shared/lib/logger";
import { enviro } from "@/shared/lib/local.env";

// Correct type: Mongoose instance, not the full module namespace.
interface MongooseCache {
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: MongooseCache | undefined;
}

function getMongoURI(): string {
  const { mongoURL, dbLocal, nodeEnv } = enviro;
  const uri = nodeEnv !== "production" ? dbLocal : mongoURL;

  if (!uri) {
    const envVar = nodeEnv !== "production" ? "DB_LOCAL" : "mack_MONGODB_URI";
    throw new Error(`Missing required environment variable: ${envVar}`);
  }

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

    // if (enviro.nodeEnv === "development") {
    //   mongoose.set("debug", true);
    // }

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
// declare global {
//   var __mongoose_cache: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// }
// // import '../../scripts/sync-env-vercel'
// export class Database {
//   private static instance: Database;
//   private constructor() {
//     // if (process.env.NODE_ENV === "development") {
//     //   mongoose.set("debug", true);
//     // }
//   }
//   public static async getInstance(): Promise<Database> {
//     const { mongoURL, dbLocal, nodeEnv } = enviro;

//     if (!global.__mongoose_cache) {
//       global.__mongoose_cache = { conn: null, promise: null };
//     }
//     const cache = global.__mongoose_cache;

//     // Choose the URI based on environment
//     const mongoURI = nodeEnv === "development" ? dbLocal : mongoURL;

//     if (!mongoURI) {
//       const envVar =
//         nodeEnv === "development" ? "DB_LOCAL" : "mack_MONGODB_URI";
//       throw new Error(`Please add your ${envVar} to .env`);
//     }

//     // Create new connection if not cached
//     if (!cache.promise) {
//       cache.promise = mongoose.connect(String(mongoURI), {
//         bufferCommands: false, // Fail fast instead of buffering
//         serverSelectionTimeoutMS: 10000, // 10s to find a server
//         socketTimeoutMS: 45000, // 45s idle socket timeout
//         connectTimeoutMS: 10000, // 10s to establish connection
//         maxPoolSize: 10, // Limit connection pool for serverless
//       });
//     }
//     try {
//       cache.conn = await cache.promise;
//       logger.log("♻️  Reusing existing MongoDB connection");
//     } catch (error) {
//       logger.error("❌ MongoDB connection error:", error);
//       cache.promise = null; // Reset promise on failure
//       throw error;
//     }
//     if (!Database.instance) {
//       logger.log("✅☁️  MongoDB connected successfully");
//       Database.instance = new Database();
//     }
//     return Database.instance;
//   }
// }
