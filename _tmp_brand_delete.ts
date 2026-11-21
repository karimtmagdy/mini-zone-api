import "dotenv/config";
import mongoose from "mongoose";

(async () => {
  const isProd = process.env.NODE_ENV === "production";
  const uri = isProd ? process.env.mack_MONGODB_URI : process.env.DB_LOCAL;
  await mongoose.connect(uri as string, { bufferCommands: false });
  console.log("connected:", mongoose.connection.host, mongoose.connection.name);

  const db = isProd ? mongoose.connection.client.db("test") : mongoose.connection.db!;
  console.log("target db:", db.databaseName);
  const col = db.collection("brands");

  const matched = await col.countDocuments({ status: "onboarding" });
  const res = await col.deleteMany({ status: "onboarding" });
  const remainingInactive = await col.countDocuments({ status: "onboarding" });
  const totalRemaining = await col.countDocuments({});

  console.log(
    JSON.stringify(
      {
        matched,
        deleted: res.deletedCount,
        remainingInactive,
        totalRemaining,
      },
      null,
      2,
    ),
  );
  await mongoose.disconnect();
})();
