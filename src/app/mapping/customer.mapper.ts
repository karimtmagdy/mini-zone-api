import { CustomerEntity } from "@/domain/entities/customer.entity";
import { CustomerDoc, CustomerRoute } from "@/domain/dto/user.dto";
import { IUser } from "@/domain/types/user.types";

export class CustomerMapper {
  static toDomain(doc: CustomerDoc): CustomerEntity {
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

    return new CustomerEntity({
      id: doc._id.toString(),
      data,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: CustomerEntity) {
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

  static toRoute(entity: CustomerEntity): CustomerRoute {
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
