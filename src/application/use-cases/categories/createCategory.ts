// import { RecordActivity } from "@/application/use-cases/activity-log/recordActivity";
import { IUser } from "@/domain/types/person.types";
import { CategoryRepoType } from "@/domain/types/category.types";
import { AppError } from "@/shared/utils/api.error";
import { Category } from "@/domain/entities/Category";
import { CreateCategoryDTO } from "@/presentation/validation/category.zod";

export class CreateCategory {
  constructor(
    private categoryRepo: CategoryRepoType,
    // private recordActivity: RecordActivity,
  ) {}

  async execute(data: CreateCategoryDTO, performer: IUser): Promise<Category> {
    const isExist = await this.categoryRepo.findByName(data.name);
    if (isExist) {
      throw AppError.conflict("category name already exists");
    }

    const category = new Category(data);
    const createdCategory = await this.categoryRepo.create(
      category,
      performer.id,
    );

    // await this.recordActivity.execute({
    //  user: {
    //    username: performer.username,
    //    email: performer.email,
    //    role: performer.role!,
    //  },
    //  action: "Category created",
    //  target: `Category: ${createdCategory.name}`,
    //  details: { categoryId: createdCategory.id },
    //  timestamp: new Date(),
    // });

    return createdCategory;
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
