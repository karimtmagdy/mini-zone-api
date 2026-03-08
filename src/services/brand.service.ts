import { AbstractService } from "./base.service.js";
import { IBrand } from "../unity/interface/brand.interface.js";
import { BrandRepo, brandRepo } from "../repo/brand.repo.js";
import { AppError } from "../class/api.error.js";

export class BrandService extends AbstractService<IBrand> {
  constructor(private readonly brandRepo: BrandRepo) {
    super(brandRepo);
  }

  async create(data: Partial<IBrand>): Promise<IBrand> {
    if (data.name) {
      const isExist = await this.exists({ name: data.name });
      if (isExist) throw AppError.conflict("Brand name already exists");
    }
    return super.create(data);
  }

  async softDelete(id: string): Promise<IBrand> {
    const isExist = await this.exists({ _id: id as any });
    if (!isExist) throw AppError.notFound("Brand not found");

    const brand = await this.brandRepo.softDelete(id);
    return brand!;
  }

  async restore(id: string): Promise<IBrand> {
    const isExist = await this.brandRepo.exists({ _id: id as any }); // Use withDeleted or direct repo check
    if (!isExist) throw AppError.notFound("Brand not found in trash");

    const brand = await this.brandRepo.restore(id);
    return brand!;
  }

  async getDeleted(): Promise<IBrand[]> {
    return this.brandRepo.findDeleted();
  }
}

export const brandService = new BrandService(brandRepo);
