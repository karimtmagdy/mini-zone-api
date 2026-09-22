import express, { type Express } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { corsOption } from "./cors-option";
// import compression from "compression";
// import hpp from "hpp";

export function ApplicationConfiguration(app: Express) {
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(corsOption());
  app.use(cookieParser());
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
  // app.use(compression());
  // app.use(hpp());
  // app.use(limiter);
}

// // const __filename = fileURLToPath(import.meta.url);
// const ROOT_DIR = path.resolve();

// export function configApp(app: Express) {
//   // Use serve-favicon library
//   // You can point this to a real file if you have one, e.g., path.join(ROOT_DIR, "favicon.ico")
//   const faviconPath = path.join(ROOT_DIR, "favicon.ico");

//   // To avoid "file not found" errors if the file doesn't exist,
//   // we check for it, or you can just ensure the file exists.
//   try {
//     app.use(favicon(faviconPath));
//   } catch (e) {
//     // If file doesn't exist, we use a transparent pixel buffer to satisfy the library
//     const icon = Buffer.from(
//       "AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
//       "base64",
//     );
//     app.use(favicon(icon));
//   }

//   // Trust first proxy (e.g., AWS ELB, Nginx) to correctly identify client IP
//   app.set("trust proxy", 1);
//   // Allow Chrome Private Network Access (HTTPS pages accessing localhost)
//   app.use((req, res, next) => {
//     if (req.headers["access-control-request-private-network"]) {
//       res.setHeader("Access-Control-Allow-Private-Network", "true");
//     }
//     next();
//   });
//   // Enable Cross-Origin Resource Sharing (CORS)
//   app.use(corsOption());

//
// Enable gzip compression for response bodies

// Prevent HTTP Parameter Pollution

//
// }

// import favicon from "serve-favicon";
// import path from "path";
