import { Brand } from "@/domain/entities/Brand";
import { BrandRepoType } from "@/domain/types/brand.types";
import { AppError } from "@/shared/utils/api.error";
import { CreateBrandDTO } from "@/presentation/validation/brand.zod";
// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";

export class CreateBrand {
  constructor(
    private brandRepo: BrandRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(data: CreateBrandDTO): Promise<Brand> {
    // async execute(data: CreateBrandDTO, performer: IUser): Promise<Brand> {
    const isExist = await this.brandRepo.findByName(data.name);
    if (isExist) {
      throw AppError.conflict("brand name already exists");
    }

    const brand = new Brand(data);
    const createdBrand = await this.brandRepo.create(brand);
    // const createdBrand = await this.brandRepo.create(brand, performer.id);

    // await this.recordActivity.execute({
    //   // user: {
    //   //   username: performer.username,
    //   //   email: performer.email,
    //   //   role: performer.role!,
    //   // },
    //   action: "Brand created",
    //   target: `Brand: ${createdBrand.name}`,
    //   details: { brandId: createdBrand.id },
    //   timestamp: new Date(),
    // });

    return createdBrand;
  }
}
