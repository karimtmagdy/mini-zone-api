import {
  BRAND_TRANSITIONS,
  IBrand,
  TBrandStatus,
} from "@/app/dto/types/brand-type";
import { AggregateRoot } from "@/domain/services/status.service";

export class BrandEntity extends AggregateRoot<
  TBrandStatus,
  typeof BRAND_TRANSITIONS
> {
  public name: string;
  public readonly slug: string;
  public readonly products: number;

  constructor(params: {
    id: string;
    data: IBrand;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super({
      id: params.id,
      status: params.data.status,
      transitions: BRAND_TRANSITIONS,
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
