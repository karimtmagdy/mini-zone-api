import { AppError } from "@/class/api.error";
import { UserRoleEnum } from "@/types/user.types";
import { UpdateUserProfile } from "@/validation/profile.schema";
import { UserRepo, userRepo } from "@/repo/user.repo";

export class ProfileService {
  constructor(protected userRepo: UserRepo) {}
  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) AppError.notFound("User not found");
    return { user };
  }

  async deleteImage(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) AppError.notFound("User not found");
    // if (data?.image?.publicId) {
    //   await cloudService.deletePhoto(data.image.publicId);
    // }
    const user = await this.userRepo.update(userId, { image: null });
    return { user };
  }

  async deactivateAccount(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) AppError.notFound("User not found");
    if (data?.role === UserRoleEnum.ADMIN)
      AppError.badRequest("You cannot deactivate yourself");
    const user = await this.userRepo.deactivate(userId);
    return { user };
  }

  async deleteHimself(userId: string) {
    const data = await this.userRepo.findById(userId);
    if (!data) AppError.notFound("User not found");
    if (data?.role === UserRoleEnum.ADMIN)
      AppError.badRequest("You cannot delete yourself");
    const user = await this.userRepo.softDelete(userId);
    return { user };
  }

  async updateUserHimself(
    userId: string,
    data: Partial<UpdateUserProfile>,
    // file?: Express.Multer.File,
  ) {
    // if (file) {
    //   const { url, publicId } = await cloudService.uploadSinglePhoto(
    //     file.path,
    //     "users",
    //   );
    //   const currentUser = await this.userRepo.findById(userId);
    //   if (currentUser?.image?.publicId) {
    //     await cloudService.deletePhoto(currentUser.image.publicId);
    //   }
    //   data.image = { url, publicId };
    //   fs.unlinkSync(file.path);
    // }
    const user = await this.userRepo.update(userId, data);
    if (!user) AppError.notFound("User not found");
    return { user };
  }
}

export const profileService = new ProfileService(userRepo);
