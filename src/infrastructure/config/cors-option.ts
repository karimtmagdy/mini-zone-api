import cors from "cors";
import { AppError } from "@/shared/utils/api.error";

export const corsOption = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://mini-zone.vercel.app",
        "http://localhost:3000",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(AppError.forbidden("Not allowed by CORS"));
      }
    },
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      // "X-Requested-With",
      // "Accept",
      // "Access-Control-Request-Private-Network",
    ],
    exposedHeaders: ["Access-Control-Allow-Private-Network"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
};
