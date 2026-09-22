import "dotenv/config";
import express from "express";
// import { setupRoutes } from "@/presentation/routes";
import { connectDB } from "@/infra/config/server/db";
import { ApplicationConfiguration } from "@/infra/config/app-config";
// import { MissingRouteHandler } from "@/presentation/middleware/global-error";
// import { errorHandler } from "@/shared/middleware/error-handler";

const app = express();
ApplicationConfiguration(app);
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

let isSeeded = false;

// API Routes
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    if (!isSeeded) {
      isSeeded = true;
      // SeedingModels();
    }
    next();
  } catch (error) {
    next(error);
  }
});

// setupRoutes(app);
// LanguageMiddleware(app);

// app.use(errorHandler);
// MissingRouteHandler(app);
export { app };
// export const handler = serverless(app);
