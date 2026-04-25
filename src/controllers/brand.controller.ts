import { Request, Response } from "express";
import { AbstractController } from "@/controllers/base.controller";
import { catchError } from "@/lib/catch.error";
import { STATUS_CODE } from "@/lib/statuscode";
import { IBrand } from "@/types/brand.dto";
import { BrandService, brandService } from "@/services/brand.service";
import { ResponseDto } from "@/validation/rules/response.schema";

export class BrandController extends AbstractController<IBrand> {
  constructor(private readonly brandService: BrandService) {
    super(brandService);
  }

  softDelete = catchError(async (req: Request, res: Response) => {
    const data = await this.brandService.softDelete(req.params.id as string);
    const response: ResponseDto<IBrand> = {
      status: "success",
      message: "Brand moved to trash",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const data = await this.brandService.restore(req.params.id as string);
    const response: ResponseDto<IBrand> = {
      status: "success",
      message: "Brand restored successfully",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const data = await this.brandService.getDeleted();
    const response: ResponseDto<IBrand[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}

export const brandCtrl = new BrandController(brandService);
