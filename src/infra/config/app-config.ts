import express, { type Express } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsOption } from "./cors-option";
import compression from "compression";
import hpp from "hpp";
import { httpLogger } from "@/common/lib/logger";

export function ApplicationConfiguration(app: Express) {
  // 1. Trust first proxy (e.g., AWS ELB, Nginx, Vercel) to correctly identify client IP
  app.set("trust proxy", 1);
  // 2. Favicon
  // const faviconPath = path.join(process.cwd(), "favicon.ico");
  // app.use(favicon(faviconPath));
  // app.use(favicon(icon));
  // 3. Security Headers
  app.use(helmet());
  // 4. Allow Chrome Private Network Access (HTTPS pages accessing localhost)
  // app.use((req, res, next) => {
  //   if (req.headers["access-control-request-private-network"]) {
  //     res.setHeader("Access-Control-Allow-Private-Network", "true");
  //   }
  //   next();
  // });
  // 5. Cross-Origin Resource Sharing (CORS)
  app.use(corsOption());
  // 6. Response Compression ( Gzip/Deflate reduce the size of response  )
  app.use(compression());
  // 7. Body Parsers (Read JSON and URL-encoded with a size limit to prevent attacks)
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: false }));
  // 8. Cookie Parser
  app.use(cookieParser());
  // 9. HTTP Parameter Pollution Protection
  app.use(hpp());
  // 10. Rate Limiting
  // app.use(limiter);
  // 11. Request Logging (pino-http)
  // if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
  app.use(httpLogger);
}

// import exSession from 'express-session'

// import from "sanitize-html"
// import lessHttp from "serverless-http"
// import favicon from "serve-favicon";
