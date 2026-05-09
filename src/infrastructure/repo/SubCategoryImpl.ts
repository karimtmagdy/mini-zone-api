import { SubCategoryRepoType } from "@/domain/interface/subcategory.interface";
import { SubCategory } from "@/domain/entities/SubCategory";
import { subCategoryModel } from "@/infrastructure/database/subcategory.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import {
  SubCategoryEnum,
  ISubCategory,
} from "@/domain/types/subcategory.types";
import { PaginatedResult } from "@/_R/types/global.dto";

export class SubCategoryRepoImpl implements SubCategoryRepoType {
  private toEntity(doc: ISubCategory): SubCategory {
    return new SubCategory({
      name: doc.name,
      status: doc.status,
      description: doc.description,
      image: doc.image,
      id: doc.id?.toString(),
      slug: doc.slug,
      products: doc.products,
      category: doc.category?.map((id) => id.toString()),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(subCategory: SubCategory): Promise<SubCategory> {
    const doc = await subCategoryModel.create({
      name: subCategory.name,
      description: subCategory.description,
      status: subCategory.status,
      image: subCategory.image,
      category: subCategory.category,
    });
    return this.toEntity(doc);
  }

  async findByName(name: string): Promise<SubCategory | null> {
    const doc = await subCategoryModel.findOne({ name });
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<SubCategory | null> {
    const doc = await subCategoryModel
      .findById(id)
      .populate({ path: "category", select: "name" })
      .populate("products");
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
  ): Promise<SubCategory | null> {
    const doc = await subCategoryModel.findByIdAndUpdate(id, subCategory, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string): Promise<SubCategory | null> {
    const doc = await subCategoryModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: SubCategoryEnum.ARCHIVED },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string): Promise<SubCategory | null> {
    const doc = await subCategoryModel
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: SubCategoryEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<SubCategory[]> {
    const docs = await subCategoryModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true });
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await subCategoryModel.countDocuments(filter);
    return count > 0;
  }
}
