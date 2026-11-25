declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    SERVER_URL: "http://localhost:3000" | "http://localhost:5173";
    CLIENT_URL: "https://mini-zone.vercel.app";
    VERCEL: "production";
    JWT_ACCESS_TOKEN: string;
    JWT_ACCESS_TTL: string;
    JWT_RESET_SECRET: string;
    JWT_RESET_TTL: string;
    JWT_SECRET_CART: string;
    JWT_CART_TTL: string;
    ROUND_SALT: number;
    GEN_VERIFY_TOKEN: string;

    MONGODB_URI: string;
    DB_LOCAL: string;
    DB_PASS: string;

    WEBHOOK_PASSWORD: string;
    STRIPE_SECRET_KEY: string;
    CLOUDINARY_API_URL: string;
    CLOUDINARY_API_SECRET_KEY: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_CLOUD_NAME: string;

    OPEN_AI_KEY: string;
    DEEP_SEEK_AI_KEY: string;
    GEMINI_A_I_KEY: string;

    SMTP_SECURE: "false" | "true";
    SMTP_HOST: string;
    SMTP_PORT: string;
    EMAIL_FROM: string;
    SMTP_USER: string;
    SMTP_PASS: string;

    // VERCEL_API: string;
    // VERCEL_TOKEN: string;
    // VERCEL_PROJECTID: string;
    // VERCEL_TEAM_ID: string;
    // WEBHOOK_URL: string;
    // STRIPE_WEBHOOK_SECRET: string;
    // DB_USER: string;
    // DB_NAME: string;
  }
}
