import mongoose from "mongoose";

/**
 * Global cache to reuse the MongoDB connection across
 * Vercel Serverless Function invocations (cold starts).
 *
 * Without this, every serverless invocation opens a NEW
 * connection and Mongoose buffers queries until it connects,
 * easily hitting the 10-second timeout on slow Atlas tiers.
 */
declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}
