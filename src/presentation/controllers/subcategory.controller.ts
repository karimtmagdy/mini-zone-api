import { Request, Response } from "express";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { SubCategory } from "@/domain/entities/SubCategory";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/_R/validation/rules/response.schema";
import { CreateSubCategory } from "@/application/use-cases/subcategories/createSubCategory";
import { GetAllSubCategories } from "@/application/use-cases/subcategories/getAllSubCategories";
import { GetSubCategoryById } from "@/application/use-cases/subcategories/getSubCategoryById";
import { UpdateSubCategory } from "@/application/use-cases/subcategories/updateSubCategory";
import { SoftDeleteSubCategory } from "@/application/use-cases/subcategories/softDeleteSubCategory";
import { RestoreSubCategory } from "@/application/use-cases/subcategories/restoreSubCategory";
import { GetDeletedSubCategories } from "@/application/use-cases/subcategories/getDeleteSubCategory";
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from "@/application/dtos/subcategory.dto";

export class SubCategoryController {
  constructor(
    private createSubCategoryUseCase: CreateSubCategory,
    private getAllSubCategoriesUseCase: GetAllSubCategories,
    private getSubCategoryByIdUseCase: GetSubCategoryById,
    private updateSubCategoryUseCase: UpdateSubCategory,
    private softDeleteSubCategoryUseCase: SoftDeleteSubCategory,
    private restoreSubCategoryUseCase: RestoreSubCategory,
    private getDeletedSubCategoriesUseCase: GetDeletedSubCategories,
  ) {}

  create = catchError(async (req: Request, res: Response) => {
    const body = req.body as CreateSubCategoryDTO;
    const result = await this.createSubCategoryUseCase.execute(body);
    const response: ResponseDto<SubCategory> = {
      status: "success",
      message: "sub category created successfully",
      data: result,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const result = await this.getAllSubCategoriesUseCase.execute(req.query);
    const response: ResponseWithMetaDto<SubCategory[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.getSubCategoryByIdUseCase.execute(id);
    const response: ResponseDto<SubCategory> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateSubCategoryDTO;
    const result = await this.updateSubCategoryUseCase.execute(id, body);
    const response: ResponseDto<SubCategory | null> = {
      status: "success",
      message: "sub category updated successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  soft = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.softDeleteSubCategoryUseCase.execute(id);
    const response: ResponseDto<SubCategory | null> = {
      status: "success",
      message: "sub category moved to trash",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.restoreSubCategoryUseCase.execute(id);
    const response: ResponseDto<SubCategory | null> = {
      status: "success",
      message: "sub category restored successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const result = await this.getDeletedSubCategoriesUseCase.execute();
    const response: ResponseDto<SubCategory[]> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}
