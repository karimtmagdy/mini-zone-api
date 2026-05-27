import "dotenv/config";
import { connect, disconnect } from "mongoose";
import { brandModel } from "@/models/brand.model"; // Adjust path as needed based on where I put the file
import { enviro } from "@/contract/lib/local.env";
import { logger } from "@/lib/logger";
const cleanFields = async () => {
  try {
    const url: string = String(enviro.dominUrl).replace(
      "<PASSWORD>",
      String(enviro.dbPass),
    );
    if (!url) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    logger.log("Connecting to database...");
    await connect(url);
    logger.log("Connected to database.");
    const field = "description";
    logger.log(
      `Removing ${field} field from all Brand documents (Bypassing Mongoose)...`,
    );
    // Use native driver to bypass Mongoose Strict Mode
    const result = await brandModel.collection.updateMany(
      { [field]: { $exists: true } },
      { $unset: { [field]: "" } }, // MongoDB native expects "" or 1, but technically any value works for $unset
    );
    logger.log(
      `Cleanup complete. matched: ${result.matchedCount}, modified: ${result.modifiedCount}`,
    );
    // Verify using native driver as well
    const remaining = await brandModel.collection.countDocuments({
      [field]: { $exists: true },
    });
    if (remaining === 0) {
      logger.log(
        `✅ VERIFICATION SUCCESS: No documents have ${field} field anymore.`,
      );
    } else {
      logger.log(
        `⚠️ VERIFICATION WARNING: ${remaining} documents still have ${field} field.`,
      );
    }
  } catch (error) {
    logger.error("Error during cleanup:", error);
  } finally {
    await disconnect();
    logger.log("Disconnected from database.");
    process.exit();
  }
};

cleanFields();
