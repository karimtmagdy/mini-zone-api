import { CategoryRepoType } from "@/domain/interface/category.interface";
import { Category } from "@/domain/entities/Category";
import { categoryModel } from "@/infrastructure/database/category.model";
import { APIFeatures } from "@/shared/utils/api.feature";
import { CategoryStatusEnum, ICategory } from "@/domain/types/category.types";
import { PaginatedResult } from "@/_R/types/global.dto";

export class CategoryRepoImpl implements CategoryRepoType {
  private toEntity(doc: ICategory): Category {
    return new Category({
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

  async create(category: Category): Promise<Category> {
    const doc = await categoryModel.create({
      name: category.name,
      description: category.description,
      status: category.status,
      image: category.image,
    });
    return this.toEntity(doc);
  }

  async findByName(name: string): Promise<Category | null> {
    const doc = await categoryModel.findOne({ name });
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<Category | null> {
    const doc = await categoryModel.findById(id).populate("products");
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
  ): Promise<Category | null> {
    const doc = await categoryModel.findByIdAndUpdate(id, category, {
      new: true,
      runValidators: true,
    });
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string): Promise<Category | null> {
    const doc = await categoryModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), status: CategoryStatusEnum.ARCHIVED },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async restore(id: string): Promise<Category | null> {
    const doc = await categoryModel
      .findByIdAndUpdate(
        id,
        { deletedAt: null, status: CategoryStatusEnum.ACTIVE },
        { new: true },
      )
      .setOptions({ withDeleted: true });
    return doc ? this.toEntity(doc) : null;
  }

  async findDeleted(): Promise<Category[]> {
    const docs = await categoryModel
      .find({ deletedAt: { $ne: null } })
      .setOptions({ withDeleted: true });
    return docs.map((doc: any) => this.toEntity(doc));
  }

  async exists(filter: any): Promise<boolean> {
    const count = await categoryModel.countDocuments(filter);
    return count > 0;
  }
}
