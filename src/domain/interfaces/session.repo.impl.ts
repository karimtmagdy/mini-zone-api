import { SessionEntity } from "@/domain/entities/session.entity";

export interface ICreateSessionData {
  userId: string;
  sessionHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ip?: string | null;
}

export interface ISessionImpl {
  create(data: ICreateSessionData): Promise<SessionEntity>;
  findBySessionHash(sessionHash: string): Promise<SessionEntity | null>;
  revoke(
    id: string,
    replacedByHash?: string | null,
  ): Promise<SessionEntity | null>;
  revokeAllForUser(userId: string): Promise<number>;
}
