import { SubCategoryRepoType } from "@/domain/types/subcategory.types";
import { SubCategory } from "@/domain/entities/SubCategory";
import { subCategoryModel } from "@/infrastructure/database/subcategory.model";
import { productModel } from "@/infrastructure/database/product.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import {
 
  ISubCategory,
} from "@/domain/types/subcategory.types";
import { PaginatedResult } from "@/types/global.dto";

export class SubCategoryRepoImpl implements SubCategoryRepoType {
  private async resolveProductsCount(doc: {
    _id?: unknown;
    id?: string;
  }): Promise<number> {
    const id = String(doc._id ?? doc.id ?? "");
    if (!id) return 0;

    return productModel.countDocuments({
      subcategory: id,
      deletedAt: null,
    });
  }

  private mapCategories(
    categories: ISubCategory["category"] | undefined,
  ): { id: string; name: string }[] {
    if (!categories?.length) return [];

    return categories.map((cat: unknown) => {
      if (typeof cat === "string") {
        return { id: cat, name: cat };
      }

      const doc = cat as Record<string, unknown>;
      const id = String(doc.id ?? doc._id ?? "");
      const name =
        typeof doc.name === "string" && doc.name.trim()
          ? doc.name.trim()
          : id;

      return { id, name };
    });
  }

  private toEntity(doc: ISubCategory, productsCount?: number): SubCategory {
    return new SubCategory({
      name: doc.name,
      status: doc.status,
      description: doc.description,
      image: doc.image,
      id: (doc.id || (doc as any)._id)?.toString(),
      slug: doc.slug,
      products: productsCount ?? doc.products ?? 0,
      category: this.mapCategories(doc.category),
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
    const populated = await subCategoryModel
      .findById(doc._id)
      .populate({ path: "category", select: "name" })
      .populate("products")
      .lean();
    const row = (populated ?? doc) as ISubCategory & { _id?: unknown };
    const productsCount = await this.resolveProductsCount(row);
    return this.toEntity(row, productsCount);
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
    if (!doc) return null;
    const productsCount = await this.resolveProductsCount(doc);
    return this.toEntity(doc as ISubCategory, productsCount);
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

    const rows = await Promise.all(
      data.data.map(async (doc: any) => {
        const productsCount = await this.resolveProductsCount(doc);
        return this.toEntity(doc, productsCount);
      }),
    );

    return {
      ...data,
      data: rows,
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
    })
      .populate({ path: "category", select: "name" })
      .populate("products");
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(
    id: string,
    performerId?: string,
  ): Promise<SubCategory | null> {
    const updateData: any = {
      deletedAt: new Date(),
      status: 'archived',
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
      status: 'active',
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
