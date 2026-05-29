import { SubCategoryRepoType } from "@/domain/types/subcategory.types";
import { SubCategory } from "@/domain/entities/SubCategory";
import { subCategoryModel } from "@/infrastructure/database/subcategory.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import {
  SubCategoryEnum,
  ISubCategory,
} from "@/domain/types/subcategory.types";
import { PaginatedResult } from "@/types/global.dto";

export class SubCategoryRepoImpl implements SubCategoryRepoType {
  private toEntity(doc: ISubCategory): SubCategory {
    return new SubCategory({
      name: doc.name,
      status: doc.status,
      description: doc.description,
      image: doc.image,
      id: (doc.id || (doc as any)._id)?.toString(),
      slug: doc.slug,
      products: doc.products,
      category: doc.category?.map((id) => id.toString()),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(
    subCategory: SubCategory,
    performerId?: string,
  ): Promise<SubCategory> {
    const data = { ...subCategory };
    if (performerId) (data as any).createdBy = performerId;
    const doc = await subCategoryModel.create(data);
    return this.toEntity(doc);
  }

  async findByName(name: string): Promise<SubCategory | null> {
    const doc = await subCategoryModel.findOne({ name }).lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<SubCategory | null> {
    const doc = await subCategoryModel
      .findById(id)
      .populate({ path: "category", select: "name" })
      .populate("products")
      .lean();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(query: any): Promise<PaginatedResult<SubCategory>> {
    const features = new APIFeatures(subCategoryModel, query);
    const data = await features
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search(["name", "slug"])
      .populate({ path: "category", select: "name" })
      .populate("products")
      .execute();

    return {
      ...data,
      data: data.data.map((doc: any) => this.toEntity(doc)),
    };
  }

  async update(
    id: string,
    subCategory: Partial<SubCategory>,
    performerId?: string,
  ): Promise<SubCategory | null> {
    const data = { ...subCategory };
    if (performerId) (data as any).updatedBy = performerId;
    const doc = await subCategoryModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(
    id: string,
    performerId?: string,
  ): Promise<SubCategory | null> {
    const updateData: any = {
      deletedAt: new Date(),
      status: SubCategoryEnum.ARCHIVED,
    };
    if (performerId) updateData.deletedBy = performerId;

    const doc = await subCategoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string, performerId?: string): Promise<SubCategory | null> {
    const updateData: any = {
      deletedAt: null,
      status: SubCategoryEnum.ACTIVE,
    };
    if (performerId) updateData.updatedBy = performerId;

    const doc = await subCategoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<SubCategory[]> {
    const docs = await subCategoryModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true })
      .lean();
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await subCategoryModel.countDocuments(filter);
    return count > 0;
  }
}
