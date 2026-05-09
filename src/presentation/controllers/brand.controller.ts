import { Request, Response } from "express";
import { CreateBrand } from "@/application/use-cases/brands/createBrand";
import { GetAllBrands } from "@/application/use-cases/brands/getAllBrands";
import { GetBrandById } from "@/application/use-cases/brands/getBrandById";
import { UpdateBrand } from "@/application/use-cases/brands/updateBrand";
import { SoftDeleteBrand } from "@/application/use-cases/brands/softDeleteBrand";
import { RestoreBrand } from "@/application/use-cases/brands/restoreBrand";
import { GetDeletedBrands } from "@/application/use-cases/brands/getDeletedBrands";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { Brand } from "@/domain/entities/Brand";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/_R/validation/rules/response.schema";
import { CreateBrandDTO, UpdateBrandDTO } from "@/application/dtos/brand.dto";

export class BrandController {
  constructor(
    private createBrandUseCase: CreateBrand,
    private getAllBrandsUseCase: GetAllBrands,
    private getBrandByIdUseCase: GetBrandById,
    private updateBrandUseCase: UpdateBrand,
    private softDeleteBrandUseCase: SoftDeleteBrand,
    private restoreBrandUseCase: RestoreBrand,
    private getDeletedBrandsUseCase: GetDeletedBrands,
  ) {}

  create = catchError(async (req: Request, res: Response) => {
    const body = req.body as CreateBrandDTO;
    const result = await this.createBrandUseCase.execute(body);
    const response: ResponseDto<Brand> = {
      status: "success",
      message: "brand created successfully",
      data: result,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const result = await this.getAllBrandsUseCase.execute(req.query);
    const response: ResponseWithMetaDto<Brand[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.getBrandByIdUseCase.execute(id);
    const response: ResponseDto<Brand> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateBrandDTO;
    const result = await this.updateBrandUseCase.execute(id, body);
    const response: ResponseDto<Brand | null> = {
      status: "success",
      message: "brand updated successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  soft = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.softDeleteBrandUseCase.execute(id);
    const response: ResponseDto<Brand | null> = {
      status: "success",
      message: "brand moved to trash",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.restoreBrandUseCase.execute(id);
    const response: ResponseDto<Brand | null> = {
      status: "success",
      message: "brand restored successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const result = await this.getDeletedBrandsUseCase.execute();
    const response: ResponseDto<Brand[]> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}
