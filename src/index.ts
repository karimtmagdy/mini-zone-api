// enable @alias imports at runtime
import "tsconfig-paths/register";
import "dotenv/config";
import express from "express";
import serverless from "serverless-http";

import { configApp } from "@/config/config-app";
import { Database } from "@/config/data/db";
import { setupRoutes } from "@/router/index";
import { MissingRouteHandler } from "@/middlewares/global.error";

const app = express();
configApp(app);

// Example API endpoint - JSON
app.get(["/"], (_req, res) => {
  res.status(200).json({
    code: 200,
    status: "success",
    api: "Mini Zone",
    message: "Welcome to the Vercel Backend",
    developer: "karimtmagdy",
    platform: "Vercel",
    version: "v1",
    environment: "production",
    time: new Date().toISOString(),
  });
});

// API Routes
app.use(async (_req, _res, next) => {
  try {
    await Database.getInstance();
    next();
  } catch (error) {
    next(error);
  }
});

setupRoutes(app);

MissingRouteHandler(app);
export { app };
export const handler = serverless(app);
