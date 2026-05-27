import { productModel } from "@/infrastructure/database/product.model";

export class GetCategoryDistribution {
  async execute() {
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
        $match: { productCount: { $gt: 0 } },
      },
    ]);
  }
}
