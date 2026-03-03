import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
// import favicon from "serve-favicon";
import helmet from "helmet";

const app = express();
app.use(helmet());
// app.use(favicon(path.join(__dirname, "favicon.ico")));

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

export { app };
export const handler = serverless(app);
// @types/node-cron @types/multer
