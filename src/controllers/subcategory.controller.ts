import { Request, Response } from "express";
import { AbstractController } from "./base.controller";
import { catchError } from "@/lib/catch.error";
import { STATUS_CODE } from "@/lib/statuscode";
import {
  SubCategoryService,
  subcategoryService,
} from "@/services/subcategory.service";
import { ISubCategory } from "@/types/subcategory.dto";
import { ResponseDto } from "@/validation/rules/response.schema";

export class SubCategoryController extends AbstractController<ISubCategory> {
  constructor(private readonly subcategoryService: SubCategoryService) {
    super(subcategoryService);
  }

  softDelete = catchError(async (req: Request, res: Response) => {
    const data = await this.subcategoryService.softDelete(req.params.id as string);
    const response: ResponseDto<ISubCategory> = {
      status: "success",
      message: "subcategory has been moved to trash",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  delete = catchError(async (req: Request, res: Response) => {
    await this.subcategoryService.delete(req.params.id as string);
    const response: ResponseDto<void> = {
      status: "success",
      message: "subcategory has been deleted successfully",
    };
    res.status(STATUS_CODE.NO_CONTENT).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const data = await this.subcategoryService.restore(req.params.id as string);
    const response: ResponseDto<ISubCategory> = {
      status: "success",
      message: "subcategory restored successfully",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const data = await this.subcategoryService.getDeleted();
    const response: ResponseDto<ISubCategory[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}

export const subcategoryCtrl = new SubCategoryController(subcategoryService);
