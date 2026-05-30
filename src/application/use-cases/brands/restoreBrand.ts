// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
 import { BrandRepoType } from "@/domain/types/brand.types";
import { IUser } from "@/domain/types/person.types";
import { AppError } from "@/shared/utils/api.error";

export class RestoreBrand {
  constructor(
    private brandRepo: BrandRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, performer?: IUser) {
    const brand = await this.brandRepo.restore(id, performer?.id);
    if (!brand) throw AppError.notFound("brand not found in archive");

    if (performer) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: "Brand restored",
    //    target: `Brand: ${brand.name}`,
    //    details: { brandId: id },
    //    timestamp: new Date(),
    //   });
    }

    return brand;
  }
}
