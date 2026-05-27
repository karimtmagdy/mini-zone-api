import { productModel } from "@/infrastructure/database/product.model";
import { brandModel } from "@/infrastructure/database/brand.model";
import { categoryModel } from "@/infrastructure/database/category.model";

export class GetRecentActivities {
  async execute() {
    const [recentProducts, recentBrands, recentCategories] = await Promise.all([
      productModel.find().sort({ createdAt: -1 }).limit(5).lean(),
      brandModel.find().sort({ createdAt: -1 }).limit(5).lean(),
      categoryModel.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return {
      products: recentProducts,
      brands: recentBrands,
      categories: recentCategories,
    };
  }
}
