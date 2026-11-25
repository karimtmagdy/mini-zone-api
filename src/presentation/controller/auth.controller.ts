import { Request, Response } from "express";
import {
  GetCurrentAccountUC,
  IAuthUser,
  LoginAuthUC,
  LogoutUC,
  RefreshSessionUC,
  RegisterAuthUC,
} from "@/app/use-cases/auth/auth.us";
import { CTErr } from "@/common/lib/catch-error";
import {
  TLoginEX,
  TRegisterEX,
  loginZod,
  registerZod,
} from "../validator/auth.zod";
import { authRepo } from "@/infra/repo/auth.repo";
import { employeeRepo } from "@/infra/repo/employee.repo";
import { sessionRepo } from "@/infra/repo/session.repo";
import { jwtUtil } from "@/common/services/jwt";
import {
  BaseCookieOptions,
  SID_COOKIE,
  cookieOptions,
} from "@/infra/config/cookies-option";

type CookieRequest = Pick<Request, "get" | "ip" | "cookies">;

export class AuthController {
  constructor(
    private readonly registerAuthUC: RegisterAuthUC,
    private readonly loginAuthUC: LoginAuthUC,
    private readonly refreshSessionUC: RefreshSessionUC,
    private readonly logoutUC: LogoutUC,
    private readonly getCurrentAccountUC: GetCurrentAccountUC,
  ) {}

  private readonly readSessionId = (req: CookieRequest): string | null =>
    (req.cookies?.[SID_COOKIE] as string | undefined) ?? null;

  private readonly tokenContext = (req: CookieRequest) => ({
    userAgent: req.get("user-agent") ?? null,
    ip: req.ip ?? null,
  });

  private readonly toUserPayload = (user: IAuthUser) => ({
    id: user.id,
    username: user.username,
    email: user.email,
  });

  register = CTErr(
    async (req: Request<unknown, unknown, TRegisterEX>, res: Response) => {
      const validated = registerZod.parse(req.body);
      const result = await this.registerAuthUC.execute(validated);
      res.status(201).json({
        status: "success",
        message: "registered successfully",
        data: {
          user: { email: result.email, id: result.id },
        },
      });
    },
  );

  login = CTErr(
    async (req: Request<unknown, unknown, TLoginEX>, res: Response) => {
      const validated = loginZod.parse(req.body);
      const result = await this.loginAuthUC.execute({
        ...validated,
        ...this.tokenContext(req),
      });
      res.cookie(SID_COOKIE, result.sessionId, cookieOptions);
      res.status(200).json({
        status: "success",
        message: "logged in successfully",
        data: { user: this.toUserPayload(result.user), token: result.token },
      });
    },
  );

  refresh = CTErr(async (req: Request, res: Response) => {
    const result = await this.refreshSessionUC.execute({
      sessionId: this.readSessionId(req),
      ...this.tokenContext(req),
    });
    res.cookie(SID_COOKIE, result.sessionId, cookieOptions);
    res.status(200).json({
      status: "success",
      message: "session refreshed successfully",
      data: { user: this.toUserPayload(result.user), token: result.token },
    });
  });

  logout = CTErr(async (req: Request, res: Response) => {
    await this.logoutUC.execute({ sessionId: this.readSessionId(req) });
    res.clearCookie(SID_COOKIE, BaseCookieOptions);
    res.status(200).json({
      status: "success",
      message: "logged out successfully",
    });
  });

  getCurrentAccount = CTErr(async (req: Request, res: Response) => {
    const userId = String(req.user.sub);
    const user = await this.getCurrentAccountUC.execute(userId);
    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          status: user.status,
          createdAt: user.createdAt,
        },
      },
    });
  });

  me = this.getCurrentAccount;
}

export const ctrlAuth = new AuthController(
  new RegisterAuthUC(authRepo),
  new LoginAuthUC(authRepo, sessionRepo, employeeRepo, jwtUtil),
  new RefreshSessionUC(authRepo, sessionRepo, employeeRepo, jwtUtil),
  new LogoutUC(sessionRepo),
  new GetCurrentAccountUC(authRepo, employeeRepo),
);
