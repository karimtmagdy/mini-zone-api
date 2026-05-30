import {
  BrandRepoType,
  
  IBrand,
} from "@/domain/types/brand.types";
import { Brand } from "@/domain/entities/Brand";
import { brandModel } from "@/infrastructure/database/brand.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { PaginatedResult } from "@/types/global.dto";

export class BrandRepoImpl implements BrandRepoType {
  private toEntity(doc: IBrand): Brand {
    return new Brand({
      name: doc.name,
      status: doc.status,
      image: doc.image,
      id: (doc.id || (doc as any)._id)?.toString(),
      slug: doc.slug,
      products: doc.products,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(brand: Brand, performerId?: string): Promise<Brand> {
    const data = { ...brand };
    if (performerId) (data as any).createdBy = performerId;
    const doc = await brandModel.create(data);
    return this.toEntity(doc);
  }

  async findByName(name: string): Promise<Brand | null> {
    const doc = await brandModel.findOne({ name }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<Brand | null> {
    const doc = await brandModel.findById(id).populate("products").lean();
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

  async update(
    id: string,
    brand: Partial<Brand>,
    performerId?: string,
  ): Promise<Brand | null> {
    const data = { ...brand };
    if (performerId) (data as any).updatedBy = performerId;
    const doc = await brandModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string, performerId?: string): Promise<Brand | null> {
    const updateData: any = {
      deletedAt: new Date(),
      status: 'archived',
    };
    if (performerId) updateData.deletedBy = performerId;

    const doc = await brandModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string, performerId?: string): Promise<Brand | null> {
    const updateData: any = { deletedAt: null, status: 'active' };
    if (performerId) updateData.updatedBy = performerId;

    const doc = await brandModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<Brand[]> {
    const docs = await brandModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true })
      .lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await brandModel.countDocuments(filter);
    return count > 0;
  }
}
