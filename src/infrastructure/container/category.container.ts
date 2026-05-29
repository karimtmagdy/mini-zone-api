import { GetAllCategories } from "@/application/use-cases/categories/getAllCategories";
import { GetCategoryById } from "@/application/use-cases/categories/getCategoryById";
import { GetDeletedCategories } from "@/application/use-cases/categories/getDeleteCategory";
import { RestoreCategory } from "@/application/use-cases/categories/restoreCategory";
import { SoftDeleteCategory } from "@/application/use-cases/categories/softDeleteCategory";
import { UpdateCategory } from "@/application/use-cases/categories/updateCategory";
import { CreateCategory } from "@/application/use-cases/categories/createCategory";
import { CategoryRepoImpl } from "@/infrastructure/repo/CategoryRepoImpl";
import { CategoryController } from "@/presentation/controllers/category.controller";

// import { recordActivityUseCase } from "./activity-log.container";

const categoryRepository = new CategoryRepoImpl();

export const createCategoryUseCase = new CreateCategory(categoryRepository);
export const getAllCategoriesUseCase = new GetAllCategories(categoryRepository);
export const getCategoryByIdUseCase = new GetCategoryById(categoryRepository);
export const updateCategoryUseCase = new UpdateCategory(categoryRepository);
export const softDeleteCategoryUseCase = new SoftDeleteCategory(
  categoryRepository,
);
export const restoreCategoryUseCase = new RestoreCategory(categoryRepository);
export const getDeletedCategoriesUseCase = new GetDeletedCategories(
  categoryRepository,
);

export const categoryCtrl = new CategoryController(
  createCategoryUseCase,
  getAllCategoriesUseCase,
  getCategoryByIdUseCase,
  updateCategoryUseCase,
  softDeleteCategoryUseCase,
  restoreCategoryUseCase,
  getDeletedCategoriesUseCase,
);
