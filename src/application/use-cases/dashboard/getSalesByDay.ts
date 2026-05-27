import { productModel } from "@/infrastructure/database/product.model";

const DAY_NAMES: Record<number, string> = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};

export class GetSalesByDay {
  async execute() {
    const data = await productModel.aggregate([
      {
        $match: {
          sold: { $gt: 0 },
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // 1=Sunday ... 7=Saturday
          revenue: { $sum: { $multiply: ["$sold", "$finalPrice"] } },
          unitsSold: { $sum: "$sold" },
          products: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          dayIndex: "$_id",
          dayName: {
            $switch: {
              branches: Object.entries(DAY_NAMES).map(([num, name]) => ({
                case: { $eq: ["$_id", Number(num)] },
                then: name,
              })),
              default: "Unknown",
            },
          },
          revenue: { $round: ["$revenue", 2] },
          unitsSold: 1,
          products: 1,
        },
      },
    ]);

    // Fill missing days with zeros so the chart is always complete (7 days)
    const filledDays = Object.entries(DAY_NAMES).map(([num, name]) => {
      const found = data.find((d) => d.dayIndex === Number(num));
      return (
        found ?? {
          dayIndex: Number(num),
          dayName: name,
          revenue: 0,
          unitsSold: 0,
          products: 0,
        }
      );
    });

    return filledDays;
  }
}
