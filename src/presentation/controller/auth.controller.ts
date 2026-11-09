import { Request, Response } from "express";
import { LoginAuthUC, RegisterAuthUC } from "@/app/use-cases/auth/auth.us";
import { CTErr } from "@/common/lib/catch-error";
import {
  TLoginEX,
  TRegisterEX,
  loginZod,
  registerZod,
} from "../validator/auth.zod";
import { authRepo } from "@/infra/repo/auth.repo";
import { jwtUtil } from "@/common/services/jwt";
import { UserMapper } from "@/app/mapping/user.mapper";
const token_options = {};
export class AuthController {
  constructor(
    private readonly registerAuthUC: RegisterAuthUC,
    private readonly loginAuthUC: LoginAuthUC,
  ) {}

  register = CTErr(
    async (req: Request<unknown, unknown, TRegisterEX>, res: Response) => {
      const validated = registerZod.parse(req.body);
      const result = await this.registerAuthUC.execute(validated);
      res.status(201).json({
        status: "success",
        message: "registered successfully",
        data: UserMapper.toRoute(result),
      });
    },
  );

  login = CTErr(
    async (req: Request<unknown, unknown, TLoginEX>, res: Response) => {
      const validated = loginZod.parse(req.body);
      const result = await this.loginAuthUC.execute(validated);
      res.cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        status: "success",
        message: "logged in successfully",
        data: {
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
          },
          token: result.token,
        },
      });
    },
  );
}

export const ctrlAuth = new AuthController(
  new RegisterAuthUC(authRepo),
  new LoginAuthUC(authRepo, jwtUtil),
);
