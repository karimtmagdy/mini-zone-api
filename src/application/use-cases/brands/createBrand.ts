import { Brand } from "@/domain/entities/Brand";
import { BrandRepoType } from "@/domain/interface/brand.interface";
import { AppError } from "@/shared/utils/api.error";
import { CreateBrandDTO } from "@/application/dtos/brand.dto";

export class CreateBrand {
  constructor(private brandRepo: BrandRepoType) {}

  async execute(data: CreateBrandDTO): Promise<Brand> {
    const isExist = await this.brandRepo.findByName(data.name);
    if (isExist) {
      AppError.conflict("brand name already exists");
    }

    const brand = new Brand(data);
    return await this.brandRepo.create(brand);
  }
}
// .name, data.status, {
//       url: data?.image?.url || "",
//       publicId: data?.image?.publicId || "",
//     }

// async create(data: CreateBrand, file?: Express.Multer.File) {
//   const exists = await this.brandRepo.findByName(data.name);
//   if (exists) {
//     ErrorFactory.throwBadRequest("Brand name already exists");
//   }

//   // Build the full payload — image comes from req.file (Multer), not from req.body
//   const createData: Record<string, any> = { ...data };
//   if (file) {
//     const { url, publicId } = await cloudService.uploadSinglePhoto(
//       file.path,
//       "brands",
//     );
//     fs.unlinkSync(file.path);
//     createData.image = { url, publicId };
//   }
//   const brand = await this.brandRepo.create(createData as any);
//   return { brand };
// }
// async update(brandId: string, data: UpdateBrand, file?: Express.Multer.File) {
//   const exists = await this.brandRepo.findById(brandId);
//   if (!exists) ErrorFactory.throwNotFound("Brand not found");

//   if (data.name) {
//     const exists = await this.brandRepo.findByName(data.name);
//     if (exists && exists._id.toString() !== brandId.toString()) {
//       ErrorFactory.throwBadRequest("Brand name already exists");
//     }
//   }

//   // Build the full update payload — image comes from req.file (Multer), not from req.body
//   let image = exists?.image;
//   if (file) {
//     const { url, publicId } = await cloudService.uploadSinglePhoto(
//       file.path,
//       "brands",
//     );
//     fs.unlinkSync(file.path);
//     image = { url, publicId };
//     if (exists?.image?.publicId) {
//       await cloudService.deletePhoto(exists.image.publicId);
//     }
//   }
//   const updateData: Partial<BrandDto> = {
//     ...data,
//     ...(image ? { image } : {}),
//   };
//   const brand = await this.brandRepo.update(brandId, updateData as any);
//   if (!brand) ErrorFactory.throwNotFound("Brand not found");
//   return { brand };
// }
