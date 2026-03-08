import { SubCategoryStatus } from "../types/subcategory.types";

export type SubCategoryDto = {
  name: string;
  slug: string;
  description?: string;
  category: string[];
  products: number;
  status: SubCategoryStatus;
};
