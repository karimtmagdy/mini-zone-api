import { CategoryDoc, CategoryRoute } from "@/app/dto/category.dto";
import { CategoryEntity } from "@/domain/entities/category.entity";
import { ICategory } from "@/domain/types/category.types";

export class CategoryMapper {
  static toDomain(doc: CategoryDoc): CategoryEntity {
    const data: ICategory = {
      name: doc.name,
      slug: doc.slug,
      products: doc.products,
      status: doc.status,
      isArchived: doc.isArchived,
      archivedAt: doc.archivedAt,
    };

    return new CategoryEntity({
      id: doc._id.toString(),
      data,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: CategoryEntity) {
    return {
      name: entity.name,
      status: entity.status,
      isArchived: entity.isArchived,
      archivedAt: entity.archivedAt,
    };
  }

  static toRoute(entity: CategoryEntity): CategoryRoute {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      products: entity.products,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isArchived: entity.isArchived,
      archivedAt: entity.archivedAt,
    };
  }
}
