import "dotenv/config";
import mongoose from "mongoose";

(async () => {
  const uri =
    process.env.NODE_ENV === "production"
      ? process.env.mack_MONGODB_URI
      : process.env.DB_LOCAL;
  await mongoose.connect(uri as string, { bufferCommands: false });
  console.log("connected:", mongoose.connection.host, mongoose.connection.name);

  const col = mongoose.connection.collection("brands");

  const matched = await col.countDocuments({ status: "inactive" });
  const res = await col.deleteMany({ status: "inactive" });
  const remainingInactive = await col.countDocuments({ status: "inactive" });
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
