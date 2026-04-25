import mongoose from "mongoose";
import { UserRole } from "./user.types";
import { IRouter, Router } from "express";



import { TokenPayload } from "./payload.types";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
/**
 * Global cache to reuse the MongoDB connection across
 * Vercel Serverless Function invocations (cold starts).
 *
 * Without this, every serverless invocation opens a NEW
 * connection and Mongoose buffers queries until it connects,
 * easily hitting the 10-second timeout on slow Atlas tiers.
 */
declare global {
  var __mongoose_cache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}
declare type Route = {
  path: string;
  router: Router;
};

declare global {
  namespace Router {
    interface Route {
      path: string;
      router: Router;
    }
  }
}
