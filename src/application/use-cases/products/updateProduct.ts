// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { ProductRepoType } from "@/domain/types/product.types";
import { AppError } from "@/shared/utils/api.error";
import { UpdateProductDTO } from "@/presentation/validation/product.zod";

export class UpdateProduct {
  constructor(
    private productRepo: ProductRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(id: string, data: UpdateProductDTO,  ) {
  // async execute(id: string, data: UpdateProductDTO, performer: IUser) {
    const product = await this.productRepo.findById(id);
    if (!product) throw AppError.notFound("product not found");

    if (data.name) {
      const existing = await this.productRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        throw AppError.conflict("product name already exists");
      }
    }

    // const updated = await this.productRepo.update(id, (data as any), performer.id!);
    const updated = await this.productRepo.update(id, (data as any)   );

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Product updated",
    //  target: `Product: ${updated?.name || id}`,
    //  details: { productId: id, updates: data },
    //  timestamp: new Date(),
    // });

    return updated;
  }
}
