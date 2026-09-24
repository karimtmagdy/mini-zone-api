import {
  CATEGORY_TRANSITIONS,
  ICategory,
  TCategoryStatus,
} from "@/domain/types/category.types";
import { AggregateRoot } from "@/common/lib/aggregate-root";

export class CategoryEntity extends AggregateRoot<
  TCategoryStatus,
  typeof CATEGORY_TRANSITIONS
> {
  public name: string;
  public readonly slug: string;
  public readonly products: number;

  constructor(params: {
    id: string;
    data: ICategory;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super({
      id: params.id,
      status: params.data.status,
      transitions: CATEGORY_TRANSITIONS,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      isArchived: params.data.isArchived,
      archivedAt: params.data.archivedAt,
    });

    this.name = params.data.name;
    this.slug = params.data.slug;
    this.products = params.data.products;
  }
}
