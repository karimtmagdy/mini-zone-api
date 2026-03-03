import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import favicon from "serve-favicon";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
// Home route - HTML
app.get("/", (req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express + TypeScript on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `);
});

app.get("/about", function (req, res) {
  const filePath = path.join(__dirname, "..", "components", "about.htm");
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send("Not found");
  });
});

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
