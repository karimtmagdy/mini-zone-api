// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { BrandRepoType } from "@/domain/types/brand.types";
import { AppError } from "@/shared/utils/api.error";
// import { Brand } from "@/domain/entities/Brand";
import { UpdateBrandDTO } from "@/presentation/validation/brand.zod";

export class UpdateBrand {
  constructor(
    private brandRepo: BrandRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, data: UpdateBrandDTO, performer?: IUser) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) throw AppError.notFound("brand not found");

    if (data.name) {
      const existing = await this.brandRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict("brand name already exists");
      }
    }

    const updated = await this.brandRepo.update(id, data, performer?.id);

    if (performer) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: "Brand updated",
    //    target: `Brand: ${updated?.name || id}`,
    //    details: { brandId: id, updates: data },
    //    timestamp: new Date(),
    //   });
    }

    return updated;
  }
}
