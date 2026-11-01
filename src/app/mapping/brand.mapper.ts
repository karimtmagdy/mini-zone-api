import { BrandEntity } from "@/domain/entities/brand.entity";
import { BrandDoc, BrandRoute } from "@/domain/dto/brand.dto";
import { IBrand } from "@/domain/types/brand.types";

export class BrandMapper {
  static toDomain(doc: BrandDoc): BrandEntity {
    const data: IBrand = {
      name: doc.name,
      slug: doc.slug,
      products: doc.products,
      status: doc.status,
      isArchived: doc.isArchived,
      archivedAt: doc.archivedAt,
    };

    return new BrandEntity({
      id: doc._id.toString(),
      data,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: BrandEntity) {
    return {
      name: entity.name,
      status: entity.status,
      isArchived: entity.isArchived,
      archivedAt: entity.archivedAt,
    };
  }

  static toRoute(entity: BrandEntity): BrandRoute {
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
