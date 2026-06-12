import { Request, Response } from "express";
import { RegisterUser } from "@/application/use-cases/auth/registerUser";
import { LoginUser } from "@/application/use-cases/auth/loginUser";
import { catchError } from "@/shared/lib/catch.error";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { ResponseDto } from "@/shared/schema/response.schema";
import { UserRepoType } from "@/domain/types/person.types";

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private userRepo: UserRepoType,
  ) {}

  register = catchError(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const result = await this.registerUser.execute(username, email, password);

    const response: ResponseDto<any> = {
      status: "success",
      message: "registered successfully",
      data: {
        user: {
          username: result.username,
          email: result.email,
        },
      },
    };

    res.status(STATUS_CODE.CREATED).json(response);
  });

  login = catchError(async (req: Request, res: Response) => {
    const deviceInfo = req.body.deviceInfo || {}; // In real app, extract from user-agent/headers
    const result = await this.loginUser.execute(req.body, deviceInfo);
    if ("status" in result && result.status === "2FA_REQUIRED") {
      res.status(STATUS_CODE.OK).json({
        status: "success",
        message: "2FA required",
        data: {
          loginToken: result.loginToken,
        },
      });
      return;
    }

    const response: ResponseDto<any> = {
      status: "success",
      message: `welcome ${(result as any).user?.username}`,
      data: result,
    };

    res.status(STATUS_CODE.OK).json(response);
  });
  account = catchError(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({ status: "error", message: "User not authenticated" });
    }
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return res.status(STATUS_CODE.NOT_FOUND).json({ status: "error", message: "User not found" });
    }
    const response: ResponseDto<any> = {
      status: "success",
      data: { user },
    };
    res.status(STATUS_CODE.OK).json(response);
  });
}

