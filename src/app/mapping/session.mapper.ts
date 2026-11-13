import { SessionDoc } from "@/domain/dto/session.dto";
import { SessionEntity } from "@/domain/entities/session.entity";
import { ISessionFields } from "@/domain/types/session.types";

export class SessionMapper {
  static toDomain(doc: SessionDoc): SessionEntity {
    const data: ISessionFields = {
      userId: doc.userId.toString(),
      sessionHash: doc.sessionHash,
      expiresAt: doc.expiresAt,
      revokedAt: doc.revokedAt ?? null,
      replacedByHash: doc.replacedByHash ?? null,
      userAgent: doc.userAgent ?? null,
      ip: doc.ip ?? null,
    };

    return new SessionEntity({
      id: doc._id.toString(),
      data,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
