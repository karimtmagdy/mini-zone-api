import mongoose, { Schema, Types } from "mongoose";
import type { Router, Request } from "express";

declare global {
  interface MongooseCache {
    promise: Promise<typeof mongoose> | null;
  }
}
declare global {
  var __mongoose_cache: MongooseCache | undefined;
}
declare global {
  interface Route {
    path: string;
    router: Router;
  }
}
declare global {
  namespace Express {
    interface Request {
      locale: "ar" | "en";
    }
  }
}
// declare module "express-rate-limit" {
//   interface Options {
//     windowMs?: number;
//     max?: number;
//   }
// }
declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}
export {};
