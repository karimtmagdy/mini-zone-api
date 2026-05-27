import { userModel } from "@/infrastructure/database/user.model";

export class GetRecentUsers {
  async execute() {
    return await userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");
  }
}
