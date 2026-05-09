import { BrandRepoType } from "@/domain/interface/brand.interface";
import { Brand } from "@/domain/entities/Brand";
import { brandModel } from "@/infrastructure/database/brand.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { BrandStatusEnum, IBrand } from "@/domain/types/brand.types";
import { PaginatedResult } from "@/_R/types/global.dto";

export class BrandRepoImpl implements BrandRepoType {
  private toEntity(doc: IBrand): Brand {
    return new Brand({
      name: doc.name,
      status: doc.status,
      image: doc.image,
      id: doc.id?.toString(),
      slug: doc.slug,
      products: doc.products,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(brand: Brand): Promise<Brand> {
    const doc = await brandModel.create({
      name: brand.name,
      status: brand.status,
      image: brand.image,
    });
    return this.toEntity(doc);
  }

  async findByName(name: string): Promise<Brand | null> {
    const doc = await brandModel.findOne({ name });
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<Brand | null> {
    const doc = await brandModel.findById(id).populate("products");
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(query: any): Promise<PaginatedResult<Brand>> {
    const features = new APIFeatures(brandModel, query);
    const data = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["name", "slug"])
      .populate("products")
      .execute();

    return {
      ...data,
      data: data.data.map((doc: any) => this.toEntity(doc)),
    };
  }

  async update(id: string, brand: Partial<Brand>): Promise<Brand | null> {
    const doc = await brandModel.findByIdAndUpdate(id, brand, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string): Promise<Brand | null> {
    const doc = await brandModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: BrandStatusEnum.ARCHIVED },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string): Promise<Brand | null> {
    const doc = await brandModel
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: BrandStatusEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<Brand[]> {
    const docs = await brandModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true });
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await brandModel.countDocuments(filter);
    return count > 0;
  }
}
