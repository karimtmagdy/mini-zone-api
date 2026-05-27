import { productModel } from "@/infrastructure/database/product.model";

export class GetProductStats {
  async execute() {
    const stats = await productModel.aggregate([
      {
        $facet: {
          statusCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          outOfStock: [
            { $match: { stock: { $lte: 0 }, deletedAt: null } },
            { $count: "count" },
          ],
          deleted: [
            { $match: { deletedAt: { $ne: null } } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const data = stats[0];
    return {
      byStatus: data.statusCounts,
      outOfStock: data.outOfStock[0]?.count || 0,
      deleted: data.deleted[0]?.count || 0,
    };
  }
}
