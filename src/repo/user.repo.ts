import { personModel } from "@/models/person.model";
import { APIFeatures } from "@/class/api.feature";
import { DEFAULT_USER_IMAGE } from "@/types/global.dto";
import { UserStatusEnum } from "@/types/user.types";
import { QueryStringDto } from "@/validation/rules/query.schema";

export class UserRepo {
  async findByEmail(email: string) {
    return await personModel
      .findOne({ email })
      .select(
        "+password +failedLoginAttempts +lockedUntil +resetOtp.code +resetOtp.expiresAt",
      );
  }
  async findById(id: string) {
    return await personModel.findById(id);
  }
  async findAll(query: QueryStringDto) {
    const features = new APIFeatures(personModel, query);
    const users = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["username", "email"])
      .execute();
    return users;
  }
  async create(user: any) {
    return await personModel.create(user);
  }
  async update(id: string, user: any) {
    return await personModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });
  }
  async softDelete(id: string) {
    return await personModel.findByIdAndUpdate(
      id,
      {
        status: UserStatusEnum.ARCHIVED,
        deletedAt: new Date(),
        image: {
          secureUrl: DEFAULT_USER_IMAGE,
          publicId: null,
        },
      },
      { new: true },
    );
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
