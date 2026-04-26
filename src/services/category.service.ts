import { AbstractService } from "@/services/base.service";
import { CategoryRepo, categoryRepo } from "@/repo/category.repo";
import { ICategory } from "@/types/category.dto";
import { AppError } from "@/class/api.error";

export class CategoryService extends AbstractService<ICategory> {
  constructor(private readonly categoryRepo: CategoryRepo) {
    super(categoryRepo);
  }

  async getAll(query: any): Promise<any> {
    return this.repo.findAllWithFeatures(query, ["name", "slug"]);
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    if (data.name) {
      const isExist = await this.exists({ name: data.name });
      if (isExist) throw AppError.conflict("Category name already exists");
    }
    return super.create(data);
  }

  async softDelete(id: string): Promise<ICategory> {
    const isExist = await this.exists({ _id: id as any });
    if (!isExist) throw AppError.notFound("Category not found");

    const category = await this.categoryRepo.softDelete(id);
    return category!;
  }

  async restore(id: string): Promise<ICategory> {
    const isExist = await this.categoryRepo.exists({ _id: id }); // Use withDeleted or direct repo check
    if (!isExist) throw AppError.notFound("Category not found in trash");

    const category = await this.categoryRepo.restore(id);
    return category!;
  }

  async getDeleted(): Promise<ICategory[]> {
    return this.categoryRepo.findDeleted();
  }
}

export const categoryService = new CategoryService(categoryRepo);
