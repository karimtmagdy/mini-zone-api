// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { ProductRepoType } from "@/domain/types/product.types";
import { AppError } from "@/shared/utils/api.error";
import { Product } from "@/domain/entities/Product";
import { CreateProductDTO } from "@/presentation/validation/product.zod";
export class CreateProduct {
  constructor(
    private productRepo: ProductRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(data: CreateProductDTO, performer: IUser): Promise<Product> {
    const isExist = await this.productRepo.findByName(data.name);
    if (isExist) {
      throw AppError.conflict("product name already exists");
    }

    const { category, subcategory, ...rest } = data;
    const product = new Product({
      ...rest,
      category: [category],
      subcategory: subcategory ?? [],
    });
    const createdProduct = await this.productRepo.create(product, performer.id!);

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Product created",
    //  target: `Product: ${createdProduct.name}`,
    //  details: { productId: createdProduct.id },
    //  timestamp: new Date(),
    // });

    return createdProduct;
  }
}
