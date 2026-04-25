import { Request, Response } from "express";
import { AuthService, authService } from "@/services/auth/auth.service";
import { catchError } from "@/lib/catch.error";
import { getUserAgent } from "@/lib/user-agent";
import { BaseCookieOptions, CookieOptions } from "@/lib/cookie-options";
import { STATUS_CODE } from "@/lib/statuscode";
import { ResponseDto } from "@/validation/rules/response.schema";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = catchError(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const result = await this.service.register(username, email, password);
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
