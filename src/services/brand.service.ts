import { AbstractService } from "@/services/base.service";
import { BrandRepo, brandRepo } from "@/repo/brand.repo";
import { AppError } from "@/class/api.error";
import { IBrand } from "@/types/brand.dto";

export class BrandService extends AbstractService<IBrand> {
  constructor(private readonly brandRepo: BrandRepo) {
    super(brandRepo);
  }

  async create(data: Partial<IBrand>): Promise<IBrand> {
    if (data.name) {
      const isExist = await this.exists({ name: data.name });
      if (isExist) throw AppError.conflict("Brand name already exists");
    }
    return super.create(data);
  }

  async softDelete(id: string): Promise<IBrand> {
    const isExist = await this.exists({ _id: id as any });
    if (!isExist) throw AppError.notFound("Brand not found");

    const brand = await this.brandRepo.softDelete(id);
    return brand!;
  }

  async restore(id: string): Promise<IBrand> {
    const isExist = await this.brandRepo.exists({ _id: id as any });
    if (!isExist) throw AppError.notFound("Brand not found in trash");

    const brand = await this.brandRepo.restore(id);
    return brand!;
  }

  async getDeleted(): Promise<IBrand[]> {
    return this.brandRepo.findDeleted();
  }
}

export const brandService = new BrandService(brandRepo);

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
