import { Request, Response } from "express";
import { AbstractController } from "./base.controller.js";
import { catchError } from "../lib/catch.error.js";
import { STATUS_CODE } from "../lib/statuscode.js";
import { ResponseDto } from "../unity/core/response.dto.js";
import {
  CategoryService,
  categoryService,
} from "../services/category.service.js";
import { ICategory } from "../unity/interface/category.interface.js";

export class CategoryController extends AbstractController<ICategory> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }

  softDelete = catchError(async (req: Request, res: Response) => {
    const data = await this.categoryService.softDelete(req.params.id as string);
    const response: ResponseDto<ICategory> = {
      status: "success",
      message: "Category moved to trash",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const data = await this.categoryService.restore(req.params.id as string);
    const response: ResponseDto<ICategory> = {
      status: "success",
      message: "Category restored successfully",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const data = await this.categoryService.getDeleted();
    const response: ResponseDto<ICategory[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}

export const categoryCtrl = new CategoryController(categoryService);
