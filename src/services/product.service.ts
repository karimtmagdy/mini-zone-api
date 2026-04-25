import { AbstractService } from "@/services/base.service";
import { ProductRepo, productRepo } from "@/repo/product.repo";
import { IProduct } from "@/types/product.dto";
import { AppError } from "@/class/api.error";

export class ProductService extends AbstractService<IProduct> {
  constructor(private readonly productRepo: ProductRepo) {
    super(productRepo);
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    if (data.name) {
      const isExist = await this.exists({ name: data.name });
      if (isExist) throw AppError.conflict("Product name already exists");
    }
    return super.create(data);
  }

  async softDelete(id: string): Promise<IProduct> {
    const isExist = await this.exists({ _id: id as any });
    if (!isExist) throw AppError.notFound("Product not found");

    const product = await this.productRepo.softDelete(id);
    return product!;
  }

  async restore(id: string): Promise<IProduct> {
    const product = await this.productRepo.restore(id);
    if (!product) throw AppError.notFound("Product not found in trash or already active");

    return product;
  }

  async getDeleted(): Promise<IProduct[]> {
    return this.productRepo.findDeleted();
  }
}

export const productService = new ProductService(productRepo);
