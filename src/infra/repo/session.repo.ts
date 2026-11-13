import { Model, Types } from "mongoose";
import { SessionMapper } from "@/app/mapping/session.mapper";
import { SessionDoc } from "@/domain/dto/session.dto";
import { SessionEntity } from "@/domain/entities/session.entity";
import {
  ICreateSessionData,
  ISessionImpl,
} from "@/domain/interfaces/session.repo.impl";
import { sessionDB } from "@/infra/db/session.db";

export class SessionRepo implements ISessionImpl {
  constructor(private readonly db: Model<SessionDoc>) {}

  async create(data: ICreateSessionData): Promise<SessionEntity> {
    const doc = await this.db.create({
      userId: new Types.ObjectId(data.userId),
      sessionHash: data.sessionHash,
      expiresAt: data.expiresAt,
      userAgent: data.userAgent ?? null,
      ip: data.ip ?? null,
    });
    return SessionMapper.toDomain(doc.toObject());
  }

  async findBySessionHash(sessionHash: string): Promise<SessionEntity | null> {
    const doc = await this.db.findOne({ sessionHash }).lean<SessionDoc>();
    if (!doc) return null;
    return SessionMapper.toDomain(doc);
  }

  async revoke(
    id: string,
    replacedByHash: string | null = null,
  ): Promise<SessionEntity | null> {
    const doc = await this.db
      .findByIdAndUpdate(
        id,
        { revokedAt: new Date(), replacedByHash },
        { new: true },
      )
      .lean<SessionDoc>();
    if (!doc) return null;
    return SessionMapper.toDomain(doc);
  }

  async revokeAllForUser(userId: string): Promise<number> {
    const result = await this.db.updateMany(
      { userId: new Types.ObjectId(userId), revokedAt: null },
      { revokedAt: new Date() },
    );
    return result.modifiedCount;
  }
}

export const sessionRepo = new SessionRepo(sessionDB);
