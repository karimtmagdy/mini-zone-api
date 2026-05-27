import { productModel } from "@/infrastructure/database/product.model";

export type SalesPeriod = "daily" | "weekly" | "monthly";

const PERIOD_FORMAT: Record<SalesPeriod, string> = {
  daily: "%Y-%m-%d",
  weekly: "%G-W%V", // ISO week: e.g. "2024-W23"
  monthly: "%Y-%m",
};

export class GetSalesData {
  async execute(period: SalesPeriod = "monthly") {
    const format = PERIOD_FORMAT[period];

    const data = await productModel.aggregate([
      {
        $match: {
          sold: { $gt: 0 },
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format, date: "$createdAt" },
          },
          revenue: { $sum: { $multiply: ["$sold", "$finalPrice"] } },
          unitsSold: { $sum: "$sold" },
          products: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: { $round: ["$revenue", 2] },
          unitsSold: 1,
          products: 1,
        },
      },
    ]);

    return { period, data };
  }
}
