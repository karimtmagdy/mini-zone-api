import { StandardTypes } from "../core/global.dto";
import { CategoryStatus } from "../types/category.types.js";

export interface ICategory extends StandardTypes {
  name: string;
  description: string;
  status: CategoryStatus;
  products: number;
}
