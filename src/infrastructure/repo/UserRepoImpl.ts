import { User } from "@/domain/entities/User";
import { IUser, UserRepoType } from "@/domain/types/person.types";
import { userModel } from "@/infrastructure/database/user.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { QueryStringDto } from "@/shared/schema/query.schema";
import { DEFAULT_USER_IMAGE } from "@/types/global.dto";
 
export class UserRepoImpl implements UserRepoType {
  private toEntity(doc: IUser): User {
    return new User({
      id: doc.id?.toString(),
      username: doc.username,
      name: doc.name,
      email: doc.email,
      role: doc.role,
      status: doc.status,
      state: doc.state,
      gender: doc.gender,
      age: doc.age,
      phone: doc.phone,
      password: doc.password,
      twoFactorEnabled: doc.twoFactorEnabled,
      lockedUntil: doc.lockedUntil,
      failedLoginAttempts: doc.failedLoginAttempts,
      lastLoginAt: doc.lastLoginAt,
      slug: doc.slug,
      image: doc.image,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(user: User, performerId?: string): Promise<User> {
    const data: Partial<IUser> = { ...user };
    if (performerId) data.createdBy = performerId;
    const doc = await userModel.create(data);
    return this.toEntity(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await userModel
      .findOne({ email })
      .select(
        "+password +failedLoginAttempts +lockedUntil +resetOtp.code +resetOtp.expiresAt",
      );
    return doc ? this.toEntity(doc) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const doc = await userModel.findOne({ username });
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await userModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async update(id: string, user: Partial<User>, performerId?: string): Promise<User | null> {
    const data: Partial<IUser> = { ...user };
    if (performerId) data.updatedBy = performerId;
    const doc = await userModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }
  async getAll(query: QueryStringDto): Promise<{ meta: (typeof users)["meta"]; data: User[] }> {
    const features = new APIFeatures(userModel, query);
    const users = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["username", "email"])
      .execute();

    return {
      meta: users.meta,
      data: users.data.map((doc: IUser) => this.toEntity(doc)),
    };
  }

  async findDeleted(query: QueryStringDto): Promise<{ meta: (typeof result)["meta"]; data: User[] }> {
    const queryWithTrash = { ...query, status: 'archived' };
    const features = new APIFeatures(userModel, queryWithTrash);
    const result = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["username", "email"])
      .execute();

    return {
      meta: result.meta,
      data: result.data.map((doc: IUser) => this.toEntity(doc)),
    };
  }

  async softDelete(id: string, performerId?: string): Promise<User | null> {
    const updateData: Partial<IUser> = {
      status: 'archived',
      deletedAt: new Date(),
      image: {
        url: DEFAULT_USER_IMAGE,
        publicId: null as unknown as string,
      },
    };
    if (performerId) updateData.deletedBy = performerId;

    const doc = await userModel.findByIdAndUpdate(id, updateData, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string, performerId?: string): Promise<User | null> {
    const updateData: Partial<IUser> = { status: 'active', deletedAt: null as unknown as Date };
    if (performerId) updateData.updatedBy = performerId;

    const doc = await userModel.findByIdAndUpdate(id, updateData, { new: true });
    return doc ? this.toEntity(doc) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await userModel.findByIdAndDelete(id);
    return !!result;
  }

  async bulkUpdate(ids: string[], data: Partial<User>, performerId?: string): Promise<number> {
    const updateData: Partial<IUser> = { ...data };
    if (performerId) updateData.updatedBy = performerId;

    const result = await userModel.updateMany(
      { _id: { $in: ids } },
      { $set: updateData },
    );
    return result.modifiedCount;
  }

  async bulkDelete(ids: string[]): Promise<number> {
    const result = await userModel.deleteMany({ _id: { $in: ids } });
    return result.deletedCount;
  }
}
