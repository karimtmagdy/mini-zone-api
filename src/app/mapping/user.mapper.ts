import { UserEntity } from "@/domain/entities/user.entity";
import { UserDoc, UserRoute } from "@/domain/dto/user.dto";
import { IUser } from "@/domain/types/user.types";

export class UserMapper {
  static toDomain(doc: UserDoc): UserEntity {
    const data: IUser = {
      username: doc.username,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      permissions: doc.permissions,
      status: doc.status,
      slug: doc.slug,
      passwordChangedAt: doc.passwordChangedAt,
      isArchived: doc.isArchived ?? false,
      archivedAt: doc.archivedAt ?? null,
    };

    return new UserEntity({
      id: doc._id.toString(),
      data,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: UserEntity) {
    return {
      username: entity.username,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      permissions: entity.permissions,
      isArchived: entity.isArchived,
      archivedAt: entity.archivedAt,
    };
  }

  static toRoute(entity: UserEntity): UserRoute {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      role: entity.role,
      permissions: entity.permissions,
      status: entity.status,
      slug: entity.slug,
      passwordChangedAt: entity.passwordChangedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isArchived: entity.isArchived,
      archivedAt: entity.archivedAt,
    };
  }
}
