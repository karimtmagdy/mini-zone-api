import { ProductRepoType } from "@/domain/interface/product.interface";
import { AppError } from "@/shared/utils/api.error";
import { Product } from "@/domain/entities/Product";
import { CreateProductDTO } from "@/application/dtos/product.dto";

export class CreateProduct {
  constructor(private productRepo: ProductRepoType) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    const isExist = await this.productRepo.findByName(data.name);
    if (isExist) {
      AppError.conflict("product name already exists");
    }

    const product = new Product(data);
    return await this.productRepo.create(product);
  }
}