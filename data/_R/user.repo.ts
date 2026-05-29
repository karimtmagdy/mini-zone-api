import { personModel } from "@/models/person/person.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { DEFAULT_USER_IMAGE } from "@/_R/global.dto";
import { UserStatusEnum } from "@/_R/user.types";
import { QueryStringDto } from "@/shared/schema/query.schema";

export class UserRepo {
  async update(id: string, user: any) {
    return await personModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });
  }

  async changeRole(id: string, role: string) {
    return await personModel.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true },
    );
  }
  async updateStatus(id: string, status: string) {
    return await personModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  }
  async deactivate(id: string) {
    return await personModel.findByIdAndUpdate(
      id,
      { status: UserStatusEnum.DEACTIVATED },
      { new: true },
    );
  }
  async reactivate(id: string) {
    return await personModel.findByIdAndUpdate(
      id,
      { status: UserStatusEnum.ACTIVE },
      { new: true },
    );
  }
  async unlock(id: string) {
    return await personModel.findByIdAndUpdate(
      id,
      {
        status: UserStatusEnum.ACTIVE,
        lockedUntil: null,
        failedLoginAttempts: 0,
      },
      { new: true },
    );
  }
  async deleteBulk(ids: string[]) {
    return await personModel.updateMany(
      { id: { $in: ids } },
      { status: UserStatusEnum.ARCHIVED, deletedAt: new Date() },
    );
  }
}
export const userRepo = new UserRepo();
