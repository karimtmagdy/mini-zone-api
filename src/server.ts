import "dotenv/config";
import "@/processes";
import { app } from "@/index";
import { logger } from "@/common/lib/logger";
import { connectDB } from "@/infra/config/server/db";

void (async () => {
  try {
    // 1. ensure database is connected
    await connectDB();

    // 2. start the server after db is ready
    app.listen(process.env.PORT, () => {
      logger.log(`🚀 Server is started on ${process.env.PORT}`);
    });
  } catch (error) {
    logger.error("🔥 Failed to start server:", error);
    process.exit(1);
  }
})();
