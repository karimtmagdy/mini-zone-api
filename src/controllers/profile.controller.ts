import { Request, Response } from "express";
import { catchError } from "@/lib/catch.error";
import {
  ProfileService,
  profileService,
} from "@/services/auth/profile.service";
import { ResponseDto } from "@/validation/rules/response.schema";
import { STATUS_CODE } from "@/lib/statuscode";

//  data: user.toJSON(),
export class ProfileController {
  constructor(protected profileService: ProfileService) {}
  getProfile = catchError(async (req: Request, res: Response) => {
    const id = req?.user?.id as string;
    const { user } = await this.profileService.getProfile(id);
    const response: ResponseDto<any> = {
      status: "success",
      data: user,
    };
    return res.status(STATUS_CODE.OK).json(response);
  });
  deleteImage = catchError(async (req: Request, res: Response) => {
    const id = req?.user?.id as string;
    const { user } = await this.profileService.deleteImage(id);
    const response: ResponseDto<any> = {
      status: "success",
      message: "your image has been deleted",
      data: user,
    };
    return res.status(STATUS_CODE.OK).json(response);
  });
  deactivateProfile = catchError(async (req: Request, res: Response) => {
    const id = req?.user?.id as string;
    const { user } = await this.profileService.deactivateAccount(id);
    const response: ResponseDto<any> = {
      status: "success",
      message: "your account has been deactivated",
      data: user,
    };
    return res.status(STATUS_CODE.OK).json(response);
  });
  deleteProfile = catchError(async (req: Request, res: Response) => {
    const id = req?.user?.id as string;
    const { user } = await this.profileService.deleteHimself(id);
    const response: ResponseDto<any> = {
      status: "success",
      message: "your account has been deleted",
      data: user,
    };
    return res.status(STATUS_CODE.OK).json(response);
  });

  updateProfile = catchError(async (req: Request, res: Response) => {
    const id = req?.user?.id as string;
    // const validatedData = req.body as UpdateUserProfile;
    // req.file,
    const { user } = await this.profileService.updateUserHimself(id, req.body);
    const response: ResponseDto<any> = {
      status: "success",
      message: "your information have been updated",
      data: user,
    };

    res.status(STATUS_CODE.OK).json(response);
  });
}
export const profileCtrl = new ProfileController(profileService);
