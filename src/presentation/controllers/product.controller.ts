import { Request, Response } from "express";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { Product } from "@/domain/entities/Product";
import {
  ResponseDto,
  ResponseWithMetaDto,
} from "@/_R/validation/rules/response.schema";
import { CreateProduct } from "@/application/use-cases/products/createProduct";
import { GetAllProducts } from "@/application/use-cases/products/getAllProducts";
import { GetProductById } from "@/application/use-cases/products/getProductById";
import { UpdateProduct } from "@/application/use-cases/products/updateProduct";
import { SoftDeleteProduct } from "@/application/use-cases/products/softDeleteProduct";
import { RestoreProduct } from "@/application/use-cases/products/restoreProduct";
import { GetDeletedProducts } from "@/application/use-cases/products/getDeleteProduct";
import {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/application/dtos/product.dto";
 
import { GetTopTenProducts } from "@/application/use-cases/products/getTopTenProducts";
import { GetRelatedProducts } from "@/application/use-cases/products/getRelatedProducts";
import { GetTopRatedProducts } from "@/application/use-cases/products/getTopRatedProducts";
import { GetLatestProducts } from "@/application/use-cases/products/getLatestProducts";
import { GetLowStockProducts } from "@/application/use-cases/products/getLowStockProducts";
import { GetHighStockProducts } from "@/application/use-cases/products/getHighStockProducts";
import { GetOutOfStockProducts } from "@/application/use-cases/products/getOutOfStockProducts";
import { UpdateProductStock } from "@/application/use-cases/products/updateProductStock";
import { GetProductsByCategory } from "@/application/use-cases/products/getProductsByCategory";
import { GetProductsByBrand } from "@/application/use-cases/products/getProductsByBrand";
import { GetProductsBySubcategory } from "@/application/use-cases/products/getProductsBySubcategory";

export class ProductController {
  constructor(
    private createProductUseCase: CreateProduct,
    private getAllProductsUseCase: GetAllProducts,
    private getProductByIdUseCase: GetProductById,
    private updateProductUseCase: UpdateProduct,
    private softDeleteProductUseCase: SoftDeleteProduct,
    private restoreProductUseCase: RestoreProduct,
    private getDeletedProductsUseCase: GetDeletedProducts,
    private getTopTenProductsUseCase: GetTopTenProducts,
    private getRelatedProductsUseCase: GetRelatedProducts,
    private getTopRatedProductsUseCase: GetTopRatedProducts,
    private getLatestProductsUseCase: GetLatestProducts,
    private getLowStockProductsUseCase: GetLowStockProducts,
    private getHighStockProductsUseCase: GetHighStockProducts,
    private getOutOfStockProductsUseCase: GetOutOfStockProducts,
    private updateProductStockUseCase: UpdateProductStock,
    private getProductsByCategoryUseCase: GetProductsByCategory,
    private getProductsByBrandUseCase: GetProductsByBrand,
    private getProductsBySubcategoryUseCase: GetProductsBySubcategory,
  ) {}

  create = catchError(async (req: Request, res: Response) => {
    const body = req.body as CreateProductDTO;
    const result = await this.createProductUseCase.execute(body);
    const response: ResponseDto<Product> = {
      status: "success",
      message: "product created successfully",
      data: result,
    };
    res.status(STATUS_CODE.CREATED).json(response);
  });

  getAll = catchError(async (req: Request, res: Response) => {
    const result = await this.getAllProductsUseCase.execute(req.query);
    const response: ResponseWithMetaDto<Product[]> = {
      status: "success",
      meta: result.meta,
      data: result.data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOne = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.getProductByIdUseCase.execute(id);
    const response: ResponseDto<Product> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  update = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const body = req.body as UpdateProductDTO;
    const result = await this.updateProductUseCase.execute(id, body);
    const response: ResponseDto<Product | null> = {
      status: "success",
      message: "product updated successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  soft = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.softDeleteProductUseCase.execute(id);
    const response: ResponseDto<Product | null> = {
      status: "success",
      message: "product moved to trash",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  restore = catchError(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await this.restoreProductUseCase.execute(id);
    const response: ResponseDto<Product | null> = {
      status: "success",
      message: "product restored successfully",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getDeleted = catchError(async (_req: Request, res: Response) => {
    const result = await this.getDeletedProductsUseCase.execute();
    const response: ResponseDto<Product[]> = {
      status: "success",
      data: result,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getTopTen = catchError(async (_req: Request, res: Response) => {
    const data = await this.getTopTenProductsUseCase.execute();
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getRelated = catchError(async (req: Request, res: Response) => {
    const data = await this.getRelatedProductsUseCase.execute(
      req.params.id as string,
    );
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getTopRated = catchError(async (_req: Request, res: Response) => {
    const data = await this.getTopRatedProductsUseCase.execute();
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getLatest = catchError(async (_req: Request, res: Response) => {
    const data = await this.getLatestProductsUseCase.execute();
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getLowStock = catchError(async (_req: Request, res: Response) => {
    const data = await this.getLowStockProductsUseCase.execute();
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getHighStock = catchError(async (_req: Request, res: Response) => {
    const data = await this.getHighStockProductsUseCase.execute();
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getOutOfStock = catchError(async (_req: Request, res: Response) => {
    const data = await this.getOutOfStockProductsUseCase.execute();
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  updateStock = catchError(async (req: Request, res: Response) => {
    const data = await this.updateProductStockUseCase.execute(
      req.params.id as string,
      req.body.stock,
    );
    const response: ResponseDto<Product | null> = {
      status: "success",
      message: "Stock updated successfully",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getByCategory = catchError(async (req: Request, res: Response) => {
    const data = await this.getProductsByCategoryUseCase.execute(
      req.params.id as string,
    );
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getByBrand = catchError(async (req: Request, res: Response) => {
    const data = await this.getProductsByBrandUseCase.execute(
      req.params.id as string,
    );
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  getBySubcategory = catchError(async (req: Request, res: Response) => {
    const data = await this.getProductsBySubcategoryUseCase.execute(
      req.params.id as string,
    );
    const response: ResponseDto<Product[]> = {
      status: "success",
      data,
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}
