import { GetAllSubCategories } from "@/application/use-cases/subcategories/getAllSubCategories";
import { GetSubCategoryById } from "@/application/use-cases/subcategories/getSubCategoryById";
import { GetDeletedSubCategories } from "@/application/use-cases/subcategories/getDeleteSubCategory";
import { RestoreSubCategory } from "@/application/use-cases/subcategories/restoreSubCategory";
import { SoftDeleteSubCategory } from "@/application/use-cases/subcategories/softDeleteSubCategory";
import { UpdateSubCategory } from "@/application/use-cases/subcategories/updateSubCategory";
import { CreateSubCategory } from "@/application/use-cases/subcategories/createSubCategory";
import { SubCategoryRepoImpl } from "@/infrastructure/repo/SubCategoryImpl";
import { SubCategoryController } from "@/presentation/controllers/subcategory.controller";

const SubCategoryRepository = new SubCategoryRepoImpl();

export const createSubCategoryUseCase = new CreateSubCategory(
  SubCategoryRepository,
);
export const getAllSubCategoriesUseCase = new GetAllSubCategories(
  SubCategoryRepository,
);
export const getSubCategoryByIdUseCase = new GetSubCategoryById(
  SubCategoryRepository,
);
export const updateCategoryUseCase = new UpdateSubCategory(
  SubCategoryRepository,
);
export const softDeleteSubCategoryUseCase = new SoftDeleteSubCategory(
  SubCategoryRepository,
);
export const restoreSubCategoryUseCase = new RestoreSubCategory(
  SubCategoryRepository,
);
export const getDeletedSubCategoriesUseCase = new GetDeletedSubCategories(
  SubCategoryRepository,
);

export const subCategoryCtrl = new SubCategoryController(
  createSubCategoryUseCase,
  getAllSubCategoriesUseCase,
  getSubCategoryByIdUseCase,
  updateCategoryUseCase,
  softDeleteSubCategoryUseCase,
  restoreSubCategoryUseCase,
  getDeletedSubCategoriesUseCase,
);
