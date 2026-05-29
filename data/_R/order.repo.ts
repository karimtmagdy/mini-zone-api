import { OrderModel } from "@/_R/order.model";
import { OrderDto } from "@/_R/order.dto";
import { AbstractRepo } from "./base.repo";
import { QueryParams } from "@/_R/global.dto";

export class OrderRepo extends AbstractRepo<OrderDto> {
  constructor() {
    super(OrderModel);
  }

  async findAllWithFeatures(params: QueryParams) {
    const query = this.model.find();

    if (params.search) {
      // Search by ID or User Name (needs population/aggregation for name)
      // For now, let's just search by ID if it's a valid ObjectId
      if (params.search.match(/^[0-9a-fA-F]{24}$/)) {
        query.where("_id").equals(params.search);
      }
    }

    if (params.status && params.status !== "all") {
      query.where("status").equals(params.status);
    }

    const total = await this.model.countDocuments(query.getFilter());

    if (params.sort) {
      query.sort(params.sort);
    } else {
      query.sort("-createdAt");
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const data = await query
      .skip(skip)
      .limit(limit)
      .populate("user", "fullName email")
      .populate("coupon", "code discount")
      .exec();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findByUserId(userId: string) {
    return this.model.find({ user: userId }).sort("-createdAt");
  }
}

export const orderRepo = new OrderRepo();
