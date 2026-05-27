import { Request, Response } from "express";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { Category } from "@/domain/entities/Category";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/shared/schema/response.schema";
import { CreateCategory } from "@/application/use-cases/categories/createCategory";
import { GetAllCategories } from "@/application/use-cases/categories/getAllCategories";
import { GetCategoryById } from "@/application/use-cases/categories/getCategoryById";
import { UpdateCategory } from "@/application/use-cases/categories/updateCategory";
import { SoftDeleteCategory } from "@/application/use-cases/categories/softDeleteCategory";
import { RestoreCategory } from "@/application/use-cases/categories/restoreCategory";
import { GetDeletedCategories } from "@/application/use-cases/categories/getDeleteCategory";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/presentation/validation/category.zod";

export class CategoryController {
  constructor(
    private createCategoryUseCase: CreateCategory,
    private getAllCategoriesUseCase: GetAllCategories,
    private getCategoryByIdUseCase: GetCategoryById,
    private updateCategoryUseCase: UpdateCategory,
    private softDeleteCategoryUseCase: SoftDeleteCategory,
    private restoreCategoryUseCase: RestoreCategory,
    private getDeletedCategoriesUseCase: GetDeletedCategories,
  ) {}

  create = catchError(async (req: Request, res: Response) => {
    const body = req.body as CreateCategoryDTO;
    const result = await this.createCategoryUseCase.execute(body, req.user);
    const response: ResponseDto<Category> = {
      status: "success",
      message: "category created successfully",
      data: result,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const result = await this.getAllCategoriesUseCase.execute(req.query);
    const response: ResponseWithMetaDto<Category[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.getCategoryByIdUseCase.execute(id);
    const response: ResponseDto<Category> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateCategoryDTO;
    const result = await this.updateCategoryUseCase.execute(id, body, req.user);
    const response: ResponseDto<Category | null> = {
      status: "success",
      message: "category updated successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  soft = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.softDeleteCategoryUseCase.execute(id, req.user);
    const response: ResponseDto<Category | null> = {
      status: "success",
      message: "category moved to trash",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.restoreCategoryUseCase.execute(id, req.user);
    const response: ResponseDto<Category | null> = {
      status: "success",
      message: "category restored successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const result = await this.getDeletedCategoriesUseCase.execute();
    const response: ResponseDto<Category[]> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}
