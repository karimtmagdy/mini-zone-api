import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
// import favicon from "serve-favicon";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { Database } from "./config/data/db.js";
import { logger } from "./lib/logger.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
// app.use(favicon(path.join(__dirname, "favicon.ico")));

// Example API endpoint - JSON
app.get("/api-data", (req, res) => {
  res.json({
    message: "Here is some sample API data",
    items: ["apple", "banana", "cherry"],
  });
});

// Health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

export { app };
export const handler = serverless(app);
// @types/node-cron @types/multer
