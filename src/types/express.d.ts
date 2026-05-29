import { Router } from "express";
import { IUser } from "@/domain/types/user.types";

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
