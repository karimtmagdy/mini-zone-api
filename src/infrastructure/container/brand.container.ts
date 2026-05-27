import { GetAllBrands } from "@/application/use-cases/brands/getAllBrands";
import { GetBrandById } from "@/application/use-cases/brands/getBrandById";
import { GetDeletedBrands } from "@/application/use-cases/brands/getDeletedBrands";
import { RestoreBrand } from "@/application/use-cases/brands/restoreBrand";
import { SoftDeleteBrand } from "@/application/use-cases/brands/softDeleteBrand";
import { UpdateBrand } from "@/application/use-cases/brands/updateBrand";
import { CreateBrand } from "@/application/use-cases/brands/createBrand";
import { BrandRepoImpl } from "@/infrastructure/repo/BrandRepoImpl";
import { BrandController } from "@/presentation/controllers/brand.controller";
import { UpdateBrandStatus } from "@/application/use-cases/brands/updateBrandStatus";

import { recordActivityUseCase } from "./activity-log.container";

// Infrastructure
const brandRepository = new BrandRepoImpl();

// Application

// Brands Use Cases
export const createBrandUseCase = new CreateBrand(
  brandRepository,
  recordActivityUseCase,
);
export const getAllBrandsUseCase = new GetAllBrands(brandRepository);
export const getBrandByIdUseCase = new GetBrandById(brandRepository);
export const updateBrandUseCase = new UpdateBrand(
  brandRepository,
  recordActivityUseCase,
);
export const softDeleteBrandUseCase = new SoftDeleteBrand(
  brandRepository,
  recordActivityUseCase,
);
export const restoreBrandUseCase = new RestoreBrand(
  brandRepository,
  recordActivityUseCase,
);
export const getDeletedBrandsUseCase = new GetDeletedBrands(brandRepository);

export const updateBrandStatusUseCase = new UpdateBrandStatus(
  brandRepository,
  recordActivityUseCase,
);

// Presentation

export const brandCtrl = new BrandController(
  createBrandUseCase,
  getAllBrandsUseCase,
  getBrandByIdUseCase,
  updateBrandUseCase,
  softDeleteBrandUseCase,
  restoreBrandUseCase,
  getDeletedBrandsUseCase,
  updateBrandStatusUseCase,
);
