import { productModel } from "@/infrastructure/database/product.model";
import { personModel } from "@/infrastructure/database/person.model";
import { categoryModel } from "@/infrastructure/database/category.model";
import { brandModel } from "@/infrastructure/database/brand.model";

export class GetOverview {
  async execute() {
    const [totalProducts, totalUsers, brandStats, categoryStats] =
      await Promise.all([
        productModel.countDocuments(),
        personModel.countDocuments(),

        brandModel.aggregate([
          {
            $facet: {
              total: [{ $count: "count" }],
              active: [
                { $match: { status: "active", deletedAt: null } },
                { $count: "count" },
              ],
              archived: [
                { $match: { status: "archived" } },
                { $count: "count" },
              ],
              deleted: [
                { $match: { deletedAt: { $ne: null } } },
                { $count: "count" },
              ],
            },
          },
        ]),
        categoryModel.aggregate([
          {
            $facet: {
              total: [{ $count: "count" }],
              active: [
                { $match: { status: "active", deletedAt: null } },
                { $count: "count" },
              ],
              archived: [
                { $match: { status: "archived" } },
                { $count: "count" },
              ],
              deleted: [
                { $match: { deletedAt: { $ne: null } } },
                { $count: "count" },
              ],
            },
          },
        ]),
      ]);

    const totalQuantity = await productModel.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } },
    ]);
    const totalValue = await productModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$stock"] } },
        },
      },
    ]);
    //
    console.log(
      await brandModel.aggregate([
        {
          $match: {   name: "Zara" },
        },
        // $lookup: {
        //   from: "brands",
        //   localField: "brand",
        //   foreignField: "_id",
        //   as: "brand",
        //   pipeline: [
        //     {
        //       $match: {
        //         // status: "active",
        //         // deletedAt: null,
        //       },
        //     },
        //   ],
        // },

        // {
        //   $project: {
        //     name: 1,
        //     stock: 1,
        //   },
        // },
        // {
        //   $unwind: "$brand",
        // },
        // {
        //   $group: {
        //     _id: "$brand._id",
        //     name: { $first: "$brand.name" },
        //     stock: { $sum: "$stock" },
        //   },
        // },
      ]),
    );
    const formatStats = (stats: any) => {
      const data = stats[0];
      return {
        total: data.total[0]?.count || 0,
        active: data.active[0]?.count || 0,
        archived: data.archived[0]?.count || 0,
        deleted: data.deleted[0]?.count || 0,
      };
    };

    return {
      products: {
        total: totalProducts,
        totalQuantity: totalQuantity[0]?.total || 0,
        totalValue: totalValue[0]?.total || 0,
      },
      users: {
        total: totalUsers,
      },
      brands: formatStats(brandStats),
      categories: formatStats(categoryStats),
    };
  }
}
