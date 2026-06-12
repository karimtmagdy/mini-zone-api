import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import { configApp } from "@/infrastructure/config/config-app";
import { connectDB } from "@/infrastructure/config/data/db";
import { MissingRouteHandler } from "@/presentation/middlewares/global.error";
import { setupRoutes } from "@/presentation/routes";
 
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

let isSeeded = false;

// API Routes
app.use(async (_req, _res, next) => {
  try {
    await connectDB();

    if (!isSeeded) {
      isSeeded = true;
      void (async () => {
        try {
          const { brandModel } = await import(
            "@/infrastructure/database/brand.model"
          );
          const count = await brandModel.countDocuments({ name: /^brand-/ });
          if (count < 10000) {
            await brandModel.deleteMany({ name: /^brand-/ });
            await brandModel.insertMany(
              Array.from({ length: 10000 }, (_, i) => ({
                name: `brand-${i}`,
                slug: `brand-${i}`,
                status: "onboarding",
              })),
              { ordered: false },
            );
            console.log("✅ 8 test brands seeded successfully in background!");
          }
        } catch (err) {
          console.error("⚠️ Error seeding test brands in background:", err);
        }
      })();
    }

    next();
  } catch (error) {
    next(error);
  }
});

setupRoutes(app);
// setupRouters(app);
MissingRouteHandler(app);
export { app };
export const handler = serverless(app);
