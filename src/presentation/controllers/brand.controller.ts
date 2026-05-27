import { Request, Response } from "express";
import { CreateBrand } from "@/application/use-cases/brands/createBrand";
import { GetAllBrands } from "@/application/use-cases/brands/getAllBrands";
import { GetBrandById } from "@/application/use-cases/brands/getBrandById";
import { UpdateBrand } from "@/application/use-cases/brands/updateBrand";
import { SoftDeleteBrand } from "@/application/use-cases/brands/softDeleteBrand";
import { RestoreBrand } from "@/application/use-cases/brands/restoreBrand";
import { GetDeletedBrands } from "@/application/use-cases/brands/getDeletedBrands";
import { UpdateBrandStatus } from "@/application/use-cases/brands/updateBrandStatus";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { Brand } from "@/domain/entities/Brand";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/shared/schema/response.schema";
import {
  CreateBrandDTO,
  UpdateBrandDTO,
  UpdateBrandStatusDTO,
} from "@/presentation/validation/brand.zod";

export class BrandController {
  constructor(
    private createBrandUC: CreateBrand,
    private getAllBrandsUC: GetAllBrands,
    private getBrandByIdUC: GetBrandById,
    private updateBrandUC: UpdateBrand,
    private softDeleteBrandUC: SoftDeleteBrand,
    private restoreBrandUC: RestoreBrand,
    private getDeletedBrandsUC: GetDeletedBrands,
    private updateBrandStatusUC: UpdateBrandStatus,
  ) {}

  create = catchError(async (req: Request, res: Response) => {
    const body = req.body as CreateBrandDTO;
    const result = await this.createBrandUC.execute(body);
    // const result = await this.createBrandUC.execute(body, req.user);
    const response: ResponseDto<Brand> = {
      status: "success",
      message: "brand created successfully",
      data: result,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const result = await this.getAllBrandsUC.execute(req.query);
    const response: ResponseWithMetaDto<Brand[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.getBrandByIdUC.execute(id);
    const response: ResponseDto<Brand> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateBrandDTO;
    const result = await this.updateBrandUC.execute(id, body, req.user);
    const response: ResponseDto<Brand | null> = {
      status: "success",
      message: "brand updated successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  soft = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.softDeleteBrandUC.execute(id, req.user);
    const response: ResponseDto<Brand | null> = {
      status: "success",
      message: "brand moved to trash",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.restoreBrandUC.execute(id, req.user);
    const response: ResponseDto<Brand | null> = {
      status: "success",
      message: "brand restored successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const result = await this.getDeletedBrandsUC.execute();
    const response: ResponseDto<Brand[]> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  updateStatus = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body as UpdateBrandStatusDTO;
    const result = await this.updateBrandStatusUC.execute(id, status, req.user);
    const response: ResponseDto<Brand | null> = {
      status: "success",
      message: "brand status updated successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}
