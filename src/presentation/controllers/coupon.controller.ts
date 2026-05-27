import { Request, Response } from "express";
import { CreateCoupon } from "@/application/use-cases/coupons/createCoupon";
import { GetAllCoupons } from "@/application/use-cases/coupons/getAllCoupons";
import { GetCouponById } from "@/application/use-cases/coupons/getCouponById";
import { UpdateCoupon } from "@/application/use-cases/coupons/updateCoupon";
import { DeleteCoupon } from "@/application/use-cases/coupons/deleteCoupon";
import { ApplyCoupon } from "@/application/use-cases/coupons/applyCoupon";
import { GenerateBulkCoupons } from "@/application/use-cases/coupons/generateBulkCoupons";
import { DeleteBulkCoupons } from "@/application/use-cases/coupons/deleteBulkCoupons";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/shared/schema/response.schema";
import { Coupon } from "@/domain/entities/Coupon";
import { activityLogService } from "@/infrastructure/container/activity-log.container";
export class CouponController {
  constructor(
    private createCouponUseCase: CreateCoupon,
    private getAllCouponsUseCase: GetAllCoupons,
    private getCouponByIdUseCase: GetCouponById,
    private updateCouponUseCase: UpdateCoupon,
    private deleteCouponUseCase: DeleteCoupon,
    private applyCouponUseCase: ApplyCoupon,
    private generateBulkCouponsUseCase: GenerateBulkCoupons,
    private deleteBulkCouponsUseCase: DeleteBulkCoupons,
  ) {}

  create = catchError(async (req: Request, res: Response) => {
    const result = await this.createCouponUseCase.execute(req.body, req.user);

    const response: ResponseDto<Coupon> = {
      status: "success",
      message: "Coupon has been created successfully",
      data: result,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const result = await this.getAllCouponsUseCase.execute(req.query);
    const response: ResponseWithMetaDto<Coupon[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.getCouponByIdUseCase.execute(id);
    const response: ResponseDto<Coupon> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.updateCouponUseCase.execute(
      id,
      req.body,
      req.user,
    );
    const response: ResponseDto<Coupon | null> = {
      status: "success",
      message: "Coupon updated successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  delete = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await this.deleteCouponUseCase.execute(id, req.user);

    const response: ResponseDto<void> = {
      status: "success",
      message: "Coupon has been deleted successfully",
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  deleteBulk = catchError(async (req: Request, res: Response) => {
    const { ids } = req.body;
    await this.deleteBulkCouponsUseCase.execute(ids, req.user);

    const response: ResponseDto<void> = {
      status: "success",
      message: "Coupons have been deleted successfully",
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  apply = catchError(async (req: Request, res: Response) => {
    const { code, orderAmount } = req.body;
    const result = await this.applyCouponUseCase.execute(code, orderAmount);

    const response: ResponseDto<any> = {
      status: "success",
      message: "Coupon applied successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  generateBulk = catchError(async (req: Request, res: Response) => {
    const result = await this.generateBulkCouponsUseCase.execute(req.body);

    if ((req as any).user) {
      await activityLogService.record({
        user: {
          name: (req as any).user.username,
          email: (req as any).user.email,
          avatar: (req as any).user.avatar,
        },
        action: "Generated Bulk Coupons",
        target: `${result.length} coupons`,
        details: { prefix: req.body.prefix, discount: req.body.discount },
        status: "info",
      });
    }

    const response: ResponseDto<any> = {
      status: "success",
      message: "Coupons generated successfully",
      data: { generated: result.length },
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });
}
