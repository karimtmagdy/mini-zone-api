// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/user.types";
import { BrandRepoType } from "@/domain/types/brand.types";
import { AppError } from "@/shared/utils/api.error";
export class SoftDeleteBrand {
  constructor(
    private brandRepo: BrandRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer?: IUser) {
    const brand = await this.brandRepo.findById(id);
    if (!brand) throw AppError.notFound("brand not found");

    const result = await this.brandRepo.softDelete(id, performer?.id);

    if (performer) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: "Brand archived",
    //    target: `Brand: ${brand.name}`,
    //    details: { brandId: id },
    //    timestamp: new Date(),
    //   });
    }

    return result;
  }
}
