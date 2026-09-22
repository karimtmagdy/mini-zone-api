import type { NextFunction, Request, Response } from "express";
// RTC
export function CTErr(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
