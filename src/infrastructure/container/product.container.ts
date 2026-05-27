import { GetAllProducts } from "@/application/use-cases/products/getAllProducts";
import { GetProductById } from "@/application/use-cases/products/getProductById";
import { GetDeletedProducts } from "@/application/use-cases/products/getDeleteProduct";
import { RestoreProduct } from "@/application/use-cases/products/restoreProduct";
import { SoftDeleteProduct } from "@/application/use-cases/products/softDeleteProduct";
import { UpdateProduct } from "@/application/use-cases/products/updateProduct";
import { CreateProduct } from "@/application/use-cases/products/createProduct";
import { ProductRepoImpl } from "@/infrastructure/repo/ProductRepoImpl";
import { ProductController } from "@/presentation/controllers/product.controller";

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

import { recordActivityUseCase } from "./activity-log.container";

const productRepository = new ProductRepoImpl();

export const createProductUseCase = new CreateProduct(
  productRepository,
  recordActivityUseCase,
);
export const getAllProductsUseCase = new GetAllProducts(productRepository);
export const getProductByIdUseCase = new GetProductById(productRepository);
export const updateProductUseCase = new UpdateProduct(
  productRepository,
  recordActivityUseCase,
);
export const softDeleteProductUseCase = new SoftDeleteProduct(
  productRepository,
  recordActivityUseCase,
);
export const restoreProductUseCase = new RestoreProduct(
  productRepository,
  recordActivityUseCase,
);
export const getDeletedProductsUseCase = new GetDeletedProducts(
  productRepository,
);
export const getTopTenProductsUseCase = new GetTopTenProducts(productRepository);
export const getRelatedProductsUseCase = new GetRelatedProducts(
  productRepository,
);
export const getTopRatedProductsUseCase = new GetTopRatedProducts(
  productRepository,
);
export const getLatestProductsUseCase = new GetLatestProducts(productRepository);
export const getLowStockProductsUseCase = new GetLowStockProducts(
  productRepository,
);
export const getHighStockProductsUseCase = new GetHighStockProducts(
  productRepository,
);
export const getOutOfStockProductsUseCase = new GetOutOfStockProducts(
  productRepository,
);
export const updateProductStockUseCase = new UpdateProductStock(
  productRepository,
  recordActivityUseCase,
);
export const getProductsByCategoryUseCase = new GetProductsByCategory(productRepository);
export const getProductsByBrandUseCase = new GetProductsByBrand(productRepository);
export const getProductsBySubcategoryUseCase = new GetProductsBySubcategory(productRepository);

export const productCtrl = new ProductController(
  createProductUseCase,
  getAllProductsUseCase,
  getProductByIdUseCase,
  updateProductUseCase,
  softDeleteProductUseCase,
  restoreProductUseCase,
  getDeletedProductsUseCase,
  getTopTenProductsUseCase,
  getRelatedProductsUseCase,
  getTopRatedProductsUseCase,
  getLatestProductsUseCase,
  getLowStockProductsUseCase,
  getHighStockProductsUseCase,
  getOutOfStockProductsUseCase,
  updateProductStockUseCase,
  getProductsByCategoryUseCase,
  getProductsByBrandUseCase,
  getProductsBySubcategoryUseCase,
);
