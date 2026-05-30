import {
  CategoryRepoType,
  
  ICategory,
} from "@/domain/types/category.types";
import { Category } from "@/domain/entities/Category";
import { categoryModel } from "@/infrastructure/database/category.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { PaginatedResult } from "@/types/global.dto";

export class CategoryRepoImpl implements CategoryRepoType {
  private toEntity(doc: ICategory): Category {
    return new Category({
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

  async create(category: Category, performerId?: string): Promise<Category> {
    const data = { ...category };
    if (performerId) (data as any).createdBy = performerId;
    const doc = await categoryModel.create(data);
    return this.toEntity(doc);
  }

  async findByName(name: string): Promise<Category | null> {
    const doc = await categoryModel.findOne({ name }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<Category | null> {
    const doc = await categoryModel.findById(id).populate("products").lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(query: any): Promise<PaginatedResult<Category>> {
    const features = new APIFeatures(categoryModel, query);
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
    category: Partial<Category>,
    performerId?: string,
  ): Promise<Category | null> {
    const data = { ...category };
    if (performerId) (data as any).updatedBy = performerId;
    const doc = await categoryModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string, performerId?: string): Promise<Category | null> {
    const updateData: any = {
      deletedAt: new Date(),
      status: 'archived',
    };
    if (performerId) updateData.deletedBy = performerId;

    const doc = await categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string, performerId?: string): Promise<Category | null> {
    const updateData: any = {
      deletedAt: null,
      status: 'active',
    };
    if (performerId) updateData.updatedBy = performerId;

    const doc = await categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<Category[]> {
    const docs = await categoryModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true })
      .lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await categoryModel.countDocuments(filter);
    return count > 0;
  }
}
