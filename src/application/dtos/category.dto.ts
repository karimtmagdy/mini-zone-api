import { CategoryStatus } from "@/domain/types/category.types";

export interface CreateCategoryDTO {
  name: string;
  description: string;
  status?: CategoryStatus;
  image?: { url: string; publicId: string };
}

export interface UpdateCategoryDTO {
  name?: string;
  description: string;
  status?: CategoryStatus;
  image?: { url: string; publicId: string };
}
