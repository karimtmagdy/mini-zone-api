import { Request, Response } from "express";
import { AbstractService } from "@/_R/base.service";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { catchError } from "@/shared/lib/catch.error";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/shared/schema/response.schema";

export abstract class AbstractController<T> {
  constructor(protected readonly service: AbstractService<T>) {}

  create = catchError(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    const response: ResponseDto<T> = {
      status: "success",
      message: "Resource has been created successfully",
      data,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const result = await this.service.getAll(req.query);
    const response: ResponseWithMetaDto<T[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id as string);
    const response: ResponseDto<T> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const data = await this.service.update(req.params.id as string, req.body);
    const response: ResponseDto<T> = {
      status: "success",
      message: "Resource has been updated successfully",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  delete = catchError(async (req: Request, res: Response) => {
    await this.service.delete(req.params.id as string);
    const response: ResponseDto<void> = {
      status: "success",
      message: "Resource has been deleted successfully",
    };
    res.status(STATUS_CODE.OK).json(response);
  });
  deleteBulk = catchError(async (req: Request, res: Response) => {
    const { ids } = req.body;
    await this.service.deleteBulk(ids);
    const response: ResponseDto<void> = {
      status: "success",
      message: "Resources have been deleted successfully",
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}
