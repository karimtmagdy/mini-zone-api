import { Request, Response } from "express";
import { AuthService, authService } from "@/_R/auth.service";
import { activityLogService } from "@/infrastructure/container/activity-log.container";
import { catchError } from "@/shared/lib/catch.error";
import { getUserAgent } from "@/shared/lib/user-agent";
import { BaseCookieOptions, CookieOptions } from "@/shared/lib/cookie-options";
import { STATUS_CODE } from "@/shared/lib/statuscode";
import { ResponseDto } from "@/shared/schema/response.schema";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  
  login = catchError(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const deviceInfo = getUserAgent(req);
    const result = await this.service.login(email, password, deviceInfo);
    if ("status" in result && result.status === "2FA_REQUIRED") {
      const response: ResponseDto<any> = {
        status: "success",
        message: "2FA Required",
        data: { loginToken: result.loginToken },
      };
      res.status(STATUS_CODE.OK).json(response);
      return;
    }
    res.cookie("refreshToken", result.refreshToken, CookieOptions);

    // Record login activity
    const authResult = result as any;
    await activityLogService.record({
      user: {
        name: authResult.user.username,
        email: authResult.user.email,
        avatar: authResult.user.avatar,
      },
      action: "Login",
      target: "Admin Panel",
      status: "info",
    });

    const response: ResponseDto<any> = {
      status: "success",
      message: "logged in successfully",
      data: {
        token: result.token,
        user: result.user,
      },
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  logout = catchError(async (req: Request, res: Response) => {
    const cookies = req.cookies as { refreshToken?: string };
    const refreshToken = cookies.refreshToken;
    if (refreshToken) {
      await this.service.logout(refreshToken);
    }
    res.clearCookie("refreshToken", BaseCookieOptions);
    const response: ResponseDto<any> = {
      status: "success",
      message: "Logged out successfully",
    };
    res.status(STATUS_CODE.OK).json(response);
  });

  logoutOtherDevices = catchError(async (req: Request, res: Response) => {});
  forgotPassword = catchError(async (req: Request, res: Response) => {});
  resetPassword = catchError(async (req: Request, res: Response) => {});
  changePassword = catchError(async (req: Request, res: Response) => {});
  refresh = catchError(async (req: Request, res: Response) => {});
  verifyEmail = catchError(async (req: Request, res: Response) => {});
  setup2FA = catchError(async (req: Request, res: Response) => {});
  enable2FA = catchError(async (req: Request, res: Response) => {});
  disable2FA = catchError(async (req: Request, res: Response) => {});
  verify2FALogin = catchError(async (req: Request, res: Response) => {});
}
export const authCtrl = new AuthController(authService);
