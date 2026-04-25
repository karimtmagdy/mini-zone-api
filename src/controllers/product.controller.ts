import { Request, Response } from "express";
import { AbstractController } from "./base.controller";
import { catchError } from "@/lib/catch.error";
import { STATUS_CODE } from "@/lib/statuscode";
import { ProductService, productService } from "@/services/product.service";
import { IProduct } from "@/types/product.dto";
import { ResponseDto } from "@/validation/rules/response.schema";

export class ProductController extends AbstractController<IProduct> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }

  softDelete = catchError(async (req: Request, res: Response) => {
    const data = await this.productService.softDelete(req.params.id as string);
    const response: ResponseDto<IProduct> = {
      status: "success",
      message: "Product moved to trash",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const data = await this.productService.restore(req.params.id as string);
    const response: ResponseDto<IProduct> = {
      status: "success",
      message: "Product restored successfully",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const data = await this.productService.getDeleted();
    const response: ResponseDto<IProduct[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}

export const productCtrl = new ProductController(productService);
