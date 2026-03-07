import "dotenv/config";
import express from "express";
import serverless from "serverless-http";

import { configApp } from "./config/config-app.js";
import { MissingRouteHandler } from "./middlewares/global.error.js";
// import rootRouter from "./router/index.js";

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
// app.use("/api/v1", rootRouter);

MissingRouteHandler(app);
export { app };
export const handler = serverless(app);
