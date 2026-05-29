import mongoose from "mongoose";
import { Router } from "express";
import { IUser } from "@/domain/types/user.types";

// Correct type: Mongoose instance, not the full module namespace.
export interface MongooseCache {
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: MongooseCache | undefined;
}

declare global {
  namespace Router {
    interface Route {
      path: string;
      router: Router;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      /**
       * The authenticated user attached by authentication middleware.
       * Optional because some routes may be public.
       */
      user?: IUser;
    }
  }
}
