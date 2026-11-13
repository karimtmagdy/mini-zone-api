import { Identifiable, Timestamped } from "@/types";
import { ISessionFields } from "@/domain/types/session.types";

export class SessionEntity implements Identifiable, Timestamped {
  private readonly _id: string;
  public readonly userId: string;
  public readonly sessionHash: string;
  public readonly expiresAt: Date;
  public readonly userAgent: string | null;
  public readonly ip: string | null;
  public revokedAt: Date | null;
  public replacedByHash: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(params: {
    id: string;
    data: ISessionFields;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = params.id;
    this.userId = params.data.userId;
    this.sessionHash = params.data.sessionHash;
    this.expiresAt = params.data.expiresAt;
    this.revokedAt = params.data.revokedAt;
    this.replacedByHash = params.data.replacedByHash;
    this.userAgent = params.data.userAgent;
    this.ip = params.data.ip;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  public get isExpired(): boolean {
    return this.expiresAt.getTime() <= Date.now();
  }

  public get isActive(): boolean {
    return !this.isRevoked && !this.isExpired;
  }

  public revoke(replacedByHash: string | null = null): void {
    this.revokedAt = new Date();
    this.replacedByHash = replacedByHash;
  }
}
