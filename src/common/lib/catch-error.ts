import type { NextFunction, Request, Response } from "express";

export const CTErr =
  (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
