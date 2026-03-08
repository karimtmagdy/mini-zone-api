import { Request, Response } from "express";
import { AbstractService } from "../services/base.service.js";
import { STATUS_CODE } from "../lib/statuscode.js";
import { catchError } from "../lib/catch.error.js";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "../unity/core/response.dto.js";

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
      message: "Resources has been retrieved successfully",
      meta: result.pagination,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id as string);
    const response: ResponseDto<T> = {
      status: "success",
      message: "Resource has been retrieved successfully",
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
}
