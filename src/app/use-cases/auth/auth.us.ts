import { AppError } from "@/common/api/api-error";
import { defaultRolePermissions } from "@/common/rule/role-permission";
import { JwtService } from "@/common/services/jwt";
import { UseCase } from "@/common/use-case";
import { IAuthImpl } from "@/domain/interfaces/auth.repo.impl";
import { UserEntity } from "@/domain/entities/user.entity";
import { TLoginEX, TRegisterEX } from "@/presentation/validator/auth.zod";
import bcrypt from "bcryptjs";

export interface ILoginResult {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export class RegisterAuthUC extends UseCase<TRegisterEX, UserEntity> {
  constructor(private readonly repo: IAuthImpl) {
    super();
  }

  async execute(data: TRegisterEX): Promise<UserEntity> {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) {
      throw new AppError("email is already registered", 409);
    }
    const created = await this.repo.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: "customer",
      permissions: defaultRolePermissions.customer,
    });
    return created;
  }
}

export class LoginAuthUC extends UseCase<TLoginEX, ILoginResult> {
  constructor(
    private readonly repo: IAuthImpl,
    private readonly jwt: JwtService,
  ) {
    super();
  }

  async execute(data: TLoginEX): Promise<ILoginResult> {
    const user = await this.repo.findByEmail(data.email, true);
    if (!user) {
      throw new AppError("invalid email or password", 401);
    }
    if (user.status !== "active") {
      throw new AppError("user account is blocked", 403);
    }
    if (!user.password) {
      throw new AppError("invalid email or password", 401);
    }

    const matched = await bcrypt.compare(data.password, user.password);
    if (!matched) {
      throw new AppError("invalid email or password", 401);
    }

    const payload = {
      sub: user.id,
      role: user.role,
      permissions: user.permissions,
    };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(payload);

    return {
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }
}
