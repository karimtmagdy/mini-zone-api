import { AbstractService } from "./base.service";
import { AppError } from "@/class/api.error";
import { SubCategoryRepo, subcategoryRepo } from "@/repo/subcategory.repo";
import { ISubCategory } from "@/types/subcategory.dto";

export class SubCategoryService extends AbstractService<ISubCategory> {
  constructor(private readonly subcategoryRepo: SubCategoryRepo) {
    super(subcategoryRepo);
  }

  async create(data: Partial<ISubCategory>): Promise<ISubCategory> {
    if (data.name) {
      const isExist = await this.exists({ name: data.name });
      if (isExist) throw AppError.conflict("subcategory already exists");
    }
    return super.create(data);
  }

  async softDelete(id: string): Promise<ISubCategory> {
    const isExist = await this.exists({ _id: id as any });
    if (!isExist) throw AppError.notFound("subcategory not found");

    const subcategory = await this.subcategoryRepo.softDelete(id);
    return subcategory!;
  }

  async restore(id: string): Promise<ISubCategory> {
    const isExist = await this.subcategoryRepo.exists({ _id: id as any });
    if (!isExist) throw AppError.notFound("subcategory not found in trash");

    const subcategory = await this.subcategoryRepo.restore(id);
    return subcategory!;
  }

  async getDeleted(): Promise<ISubCategory[]> {
    return this.subcategoryRepo.findDeleted();
  }
}

export const subcategoryService = new SubCategoryService(subcategoryRepo);
