import type { Application, NextFunction, Request, Response } from "express";

export const GlobalErrorHandler = (app: Application) => {
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[ERROR]", err.message);
    const statusMap: Record<string, number> = {
      "not found": 404,
      "already exists": 409,
      "invalid credentials": 401,
    };

    const status =
      Object.entries(statusMap).find(([key]) =>
        err.message.toLowerCase().includes(key),
      )?.[1] ?? 500;

    res.status(status).json({ success: false, message: err.message });
  });
};
