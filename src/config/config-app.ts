import express, { Express } from "express";
import { corsOption } from "./cors-option";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import hpp from "hpp";
import favicon from "serve-favicon";
import path from "path";
 import morgan from "morgan";

// const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.resolve();

export function configApp(app: Express) {
  // Use serve-favicon library
  // You can point this to a real file if you have one, e.g., path.join(ROOT_DIR, "favicon.ico")
  const faviconPath = path.join(ROOT_DIR, "favicon.ico");

  // To avoid "file not found" errors if the file doesn't exist,
  // we check for it, or you can just ensure the file exists.
  try {
    app.use(favicon(faviconPath));
  } catch (e) {
    // If file doesn't exist, we use a transparent pixel buffer to satisfy the library
    const icon = Buffer.from(
      "AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
      "base64",
    );
    app.use(favicon(icon));
  }

  // Trust first proxy (e.g., AWS ELB, Nginx) to correctly identify client IP
  app.set("trust proxy", 1);
  // Enable Cross-Origin Resource Sharing (CORS)
  app.use(corsOption());
  // Parse JSON request bodies
  app.use(express.json({ limit: "10kb" }));
  // Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  // Apply security headers
  app.use(helmet());
  // Parse cookies
  app.use(cookieParser());
  // Enable gzip compression for response bodies
  app.use(compression());
  // Prevent HTTP Parameter Pollution
  app.use(hpp());
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
}
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   }),
// );
