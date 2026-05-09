import { BrandStatus } from "@/domain/types/brand.types";

export interface CreateBrandDTO {
  name: string;
  status?: BrandStatus;
  image?: { url: string; publicId: string };
}

export interface UpdateBrandDTO {
  name?: string;
  status?: BrandStatus;
  image?: { url: string; publicId: string };
}
