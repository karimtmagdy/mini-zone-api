import { OrderRepo, orderRepo } from "@/_R/order.repo";
import { OrderDto, OrderStatus, PaymentStatus } from "@/_R/order.dto";
import { QueryParams } from "@/_R/global.dto";
import { AppError } from "@/shared/utils/api.error";

export class OrderService {
  // constructor(private repo: OrderRepo) {
  //    super(repo);
  // }
  async getAll(params: QueryParams) {
    return orderRepo.findAllWithFeatures(params);
  }

  async getOne(id: string) {
    const order = await orderRepo.findById(id);
    if (!order) AppError.notFound("Order not found");
    // Repopulate for details
    return orderRepo.model
      .findById(id)
      .populate("user", "fullName email phone")
      .populate("orderItems.product")
      .populate("coupon")
      .exec();
  }

  async create(data: Partial<OrderDto>) {
    return orderRepo.create(data as OrderDto);
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.getOne(id);
    if (!order) AppError.notFound("Order not found");

    const updateData: any = { status };
    if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    return orderRepo.updateById(id, updateData);
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    paymentResult?: any,
  ) {
    const order = await this.getOne(id);
    if (!order) AppError.notFound("Order not found");
    const updateData: any = { paymentStatus };
    if (paymentStatus === PaymentStatus.PAID) {
      updateData.isPaid = true;
      updateData.paidAt = new Date();
      if (paymentResult) {
        updateData.paymentResult = paymentResult;
      }
    }

    return orderRepo.updateById(id, updateData);
  }

  async getMyOrders(userId: string) {
    return orderRepo.findByUserId(userId);
  }
}

export const orderService = new OrderService();
