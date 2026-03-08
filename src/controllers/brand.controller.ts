import { Request, Response } from "express";
import { AbstractController } from "./base.controller.js";
import { IBrand } from "../unity/interface/brand.interface.js";
import { BrandService, brandService } from "../services/brand.service.js";
import { catchError } from "../lib/catch.error.js";
import { STATUS_CODE } from "../lib/statuscode.js";
import { ResponseDto } from "../unity/core/response.dto.js";

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
