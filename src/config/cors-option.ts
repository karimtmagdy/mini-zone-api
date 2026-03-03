import cors from "cors";

export const corsOption = () => {
  return cors({
    origin: (origin, callback) => {
      const { CLIENT_URL, DOMIN_URL } = process.env;
      const allowedOrigins = [CLIENT_URL, DOMIN_URL];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
};
