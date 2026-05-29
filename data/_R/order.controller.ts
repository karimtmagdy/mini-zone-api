import { Request, Response } from "express";
import { orderService } from "@/_R/order.service";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/shared/schema/response.schema";

export class OrderController {
  getAll = catchError(async (req: Request, res: Response) => {
    const result = await orderService.getAll(req.query as any);
    const response: ResponseWithMetaDto<any> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const order = await orderService.getOne(req.params.id);
    const response: ResponseDto<any> = {
      status: "success",
      data: order,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  create = catchError(async (req: Request, res: Response) => {
    // Usually orders are created by customers, but admin can too
    const order = await orderService.create({
      ...req.body,
      user: req.body.user || (req as any).user.id,
    });
    const response: ResponseDto<any> = {
      status: "success",
      data: order,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  updateStatus = catchError(async (req: Request, res: Response) => {
    const order = await orderService.updateStatus(
      req.params.id,
      req.body.status,
    );
    const response: ResponseDto<any> = {
      status: "success",
      data: order,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  updatePaymentStatus = catchError(async (req: Request, res: Response) => {
    const order = await orderService.updatePaymentStatus(
      req.params.id,
      req.body.paymentStatus,
      req.body.paymentResult,
    );
    const response: ResponseDto<any> = {
      status: "success",
      data: order,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getMyOrders = catchError(async (req: Request, res: Response) => {
    const orders = await orderService.getMyOrders((req as any).user.id);
    const response: ResponseDto<any> = {
      status: "success",
      data: orders,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}

export const orderCtrl = new OrderController();
