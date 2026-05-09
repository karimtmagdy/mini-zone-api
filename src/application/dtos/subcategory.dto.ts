 import { SubCategoryStatus } from "@/domain/types/subcategory.types";

export interface CreateSubCategoryDTO {
  name: string;
  description: string;
  status?: SubCategoryStatus;
  category: string[];
  image?: { url: string; publicId: string };
}

export interface UpdateSubCategoryDTO {
  name?: string;
  description: string;
  status?: SubCategoryStatus;
  category: string[];
  image?: { url: string; publicId: string };
}
