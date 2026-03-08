import { StandardTypes } from "../core/global.dto.js";
import { BrandStatus } from "../types/brand.types.js";

export interface IBrand extends StandardTypes {
  name: string;
  status: BrandStatus;
  products: number;
}
