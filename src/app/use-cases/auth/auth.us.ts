import { AppError, ErrorCode } from "@/common/api/api-error";
import { generateSessionId, hashToken } from "@/common/lib/token-hash";
import { defaultRolePermissions } from "@/common/rule/role-permission";
import { JwtService } from "@/common/services/jwt";
// import type { AccessTokenPayload } from "@/common/middleware/token-payload";
import { UseCase } from "@/common/use-case";
import { IAuthImpl } from "@/domain/interfaces/auth.repo.impl";
import { ISessionImpl } from "@/domain/interfaces/session.repo.impl";
import { CustomerEntity } from "@/domain/entities/customer.entity";
import { SESSION_TTL_MS } from "@/domain/types/session.types";
import { TLoginEX, TRegisterEX } from "@/presentation/validator/auth.zod";

export interface IAuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface IAuthSessionResult {
  token: string;
  sessionId: string;
  user: IAuthUser;
}

export interface ITokenContext {
  userAgent?: string | null;
  ip?: string | null;
}

export interface ILoginInput extends TLoginEX, ITokenContext {}

export interface IRefreshInput extends ITokenContext {
  sessionId?: string | null;
}

export interface ILogoutInput {
  sessionId?: string | null;
}
export interface IAuthUserWithLock extends IAuthUser {
  lockedUntil?: Date;
  failedLoginAttempts: number;
  lastLoginAt?: Date;
}

const toAuthUser = (user: CustomerEntity): IAuthUserWithLock => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  permissions: user.permissions,
  lockedUntil: user.lockedUntil,
  failedLoginAttempts: user.failedLoginAttempts,
  lastLoginAt: user.lastLoginAt,
});

const sessionExpiry = (): Date => new Date(Date.now() + SESSION_TTL_MS);

export class RegisterAuthUC extends UseCase<TRegisterEX, CustomerEntity> {
  constructor(private readonly repo: IAuthImpl) {
    super();
  }

  async execute(data: TRegisterEX): Promise<CustomerEntity> {
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

export class LoginAuthUC extends UseCase<ILoginInput, IAuthSessionResult> {
  constructor(
    private readonly repo: IAuthImpl,
    private readonly sessionRepo: ISessionImpl,
    private readonly jwt: JwtService,
  ) {
    super();
  }

  async execute(data: ILoginInput): Promise<IAuthSessionResult> {
    const user = await this.repo.findByEmail(data.email);
    if (!user) {
      throw new AppError("invalid email or password", 401);
    }
    if (user.isLocked()) {
      throw new AppError("user account is locked", 403);
    }
    if (user.status !== "active") {
      throw new AppError("user account is blocked", 403);
    }

    const matched = await this.repo.verifyPassword(data.email, data.password);
    if (!matched) {
      throw new AppError("invalid email or password", 401);
    }

    const token = this.jwt.issue({
      sub: user.id,
      role: user.role,
      permissions: user.permissions,
    }).token;

    // The raw session id goes to the httpOnly cookie; only its hash is stored.
    const sessionId = generateSessionId();
    await this.sessionRepo.create({
      userId: user.id,
      sessionHash: hashToken(sessionId),
      expiresAt: sessionExpiry(),
      userAgent: data.userAgent,
      ip: data.ip,
    });

    return { token, sessionId, user: toAuthUser(user) };
  }
}

export class RefreshSessionUC extends UseCase<
  IRefreshInput,
  IAuthSessionResult
> {
  constructor(
    private readonly repo: IAuthImpl,
    private readonly sessionRepo: ISessionImpl,
    private readonly jwt: JwtService,
  ) {
    super();
  }

  async execute(data: IRefreshInput): Promise<IAuthSessionResult> {
    const rawSessionId = data.sessionId;
    if (!rawSessionId) {
      throw new AppError("session is required", 401, ErrorCode.UNAUTHORIZED);
    }

    const session = await this.sessionRepo.findBySessionHash(
      hashToken(rawSessionId),
    );
    if (!session) {
      throw new AppError("invalid session", 401, ErrorCode.UNAUTHORIZED);
    }

    // A revoked id being replayed means it was stolen: kill the whole family.
    if (session.isRevoked) {
      await this.sessionRepo.revokeAllForUser(session.userId);
      throw new AppError(
        "session has been revoked",
        401,
        ErrorCode.UNAUTHORIZED,
      );
    }
    if (session.isExpired) {
      throw new AppError("session has expired", 401, ErrorCode.JWT_EXPIRED);
    }

    const user = await this.repo.findById(session.userId);
    if (!user) {
      throw new AppError("user not found", 401, ErrorCode.UNAUTHORIZED);
    }
    if (user.isLocked()) {
      throw new AppError("user account is locked", 403, ErrorCode.FORBIDDEN);
    }
    if (user.status !== "active") {
      throw new AppError("user account is blocked", 403, ErrorCode.FORBIDDEN);
    }

    // Rotate: issue a fresh session id and revoke the presented one.
    const sessionId = generateSessionId();
    const newHash = hashToken(sessionId);
    await this.sessionRepo.revoke(session.id, newHash);
    await this.sessionRepo.create({
      userId: user.id,
      sessionHash: newHash,
      expiresAt: sessionExpiry(),
      userAgent: data.userAgent,
      ip: data.ip,
    });

    const token = this.jwt.issue({
      sub: user.id,
      role: user.role,
      permissions: user.permissions,
    }).token;

    return { token, sessionId, user: toAuthUser(user) };
  }
}

export class LogoutUC extends UseCase<ILogoutInput, void> {
  constructor(private readonly sessionRepo: ISessionImpl) {
    super();
  }

  async execute(data: ILogoutInput): Promise<void> {
    if (!data.sessionId) return;
    const session = await this.sessionRepo.findBySessionHash(
      hashToken(data.sessionId),
    );
    if (session && !session.isRevoked) {
      await this.sessionRepo.revoke(session.id);
    }
  }
}

export class GetCurrentAccountUC extends UseCase<string, CustomerEntity> {
  constructor(private readonly repo: IAuthImpl) {
    super();
  }

  async execute(userId: string): Promise<CustomerEntity> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new AppError("user not found", 404, ErrorCode.NOT_FOUND);
    }
    if (user.isLocked()) {
      throw new AppError("user account is locked", 403, ErrorCode.FORBIDDEN);
    }
    if (user.status !== "active") {
      throw new AppError("user account is blocked", 403, ErrorCode.FORBIDDEN);
    }
    if (user.isArchived) {
      throw new AppError("user account is archived", 403, ErrorCode.FORBIDDEN);
    }
    return user;
  }
}
