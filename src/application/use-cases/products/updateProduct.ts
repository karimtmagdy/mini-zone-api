import { ProductRepoType } from "@/domain/interface/product.interface";
import { AppError } from "@/shared/utils/api.error";
import { UpdateProductDTO } from "@/application/dtos/product.dto";

export class UpdateProduct {
  constructor(private productRepo: ProductRepoType) {}

  async execute(id: string, data: UpdateProductDTO) {
    const product = await this.productRepo.findById(id);
    if (!product) AppError.notFound("product not found");

    if (data.name) {
      const existing = await this.productRepo.findByName(data.name);
      if (existing && existing.id !== id) {
        AppError.conflict("product name already exists");
      }
    }

    const updated = await this.productRepo.update(id, data);
    return updated;
  }
}
