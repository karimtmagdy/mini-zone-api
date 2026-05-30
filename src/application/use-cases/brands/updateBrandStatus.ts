// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { StatusService } from "@/application/services/status.service";
import { BrandStatus, BrandRepoType, BRAND_TRANSITIONS } from "@/domain/types/brand.types";
import { Brand } from "@/domain/entities/Brand";

/**
 * Use case to update brand status with transaction validation and activity logging.
 */
export class UpdateBrandStatus {
  private readonly statusService: StatusService<Brand, BrandStatus>;

  constructor(
    private readonly brandRepo: BrandRepoType,
    // private readonly recordActivity: RecordActivity,
  ) {
    this.statusService = new StatusService<Brand, BrandStatus>(
      this.brandRepo,
      BRAND_TRANSITIONS,
    );
  }

  async execute(
    id: string,
    newStatus: BrandStatus,
    performer?: IUser,
  ): Promise<Brand> {
    const updated = await this.statusService.changeStatus(
      id,
      newStatus,
      performer?.id,
    );

    if (performer) {
      // await this.recordActivity.execute({
    //    user: {
    //      username: performer.username,
    //      email: performer.email,
    //      role: performer.role!,
    //    },
    //    action: `Brand status updated to ${newStatus}`,
    //    target: `Brand: ${updated?.name || id}`,
    //    details: { brandId: id, newStatus },
    //    timestamp: new Date(),
    //   });
    }

    return updated;
  }
}
