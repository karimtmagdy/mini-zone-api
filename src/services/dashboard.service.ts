import { productModel } from "@/models/product.model";
import { personModel } from "@/models/person.model";
import { categoryModel } from "@/models/category.model";
import { brandModel } from "@/models/brand.model";

export class DashboardService {
  async getOverview() {
    const [totalProducts, totalUsers, totalCategories, totalBrands] = await Promise.all([
      productModel.countDocuments(),
      personModel.countDocuments(),
      categoryModel.countDocuments(),
      brandModel.countDocuments(),
    ]);

    const totalQuantity = await productModel.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);
    const totalValue = await productModel.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } },
    ]);

    return {
      totalProducts,
      totalUsers,
      totalCategories,
      totalBrands,
      totalQuantity: totalQuantity[0]?.total || 0,
      totalValue: totalValue[0]?.total || 0,
    };
  }

  async getProductStats() {
    return await productModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async getCategoryDistribution() {
    return await productModel.aggregate([
      {
        $group: {
          _id: "$category",
          productCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $project: {
          _id: 1,
          name: "$categoryDetails.name",
          productCount: 1,
        },
      },
      {
        $match: { productCount: { $gt: 0 } }
      }
    ]);
  }

  async getRecentUsers() {
    return await personModel.find().sort({ createdAt: -1 }).limit(5).select("-password");
  }
  
  async getSalesData() {
    return [
      { date: "2024-01-01", sales: 4000 },
      { date: "2024-02-01", sales: 3000 },
      { date: "2024-03-01", sales: 2000 },
      { date: "2024-04-01", sales: 2780 },
      { date: "2024-05-01", sales: 1890 },
      { date: "2024-06-01", sales: 2390 },
      { date: "2024-07-01", sales: 3490 },
    ];
  }
}

export const dashboardService = new DashboardService();
