/** Lifetime of a server-side session (also the `sid` cookie max-age). */
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface ISessionFields {
  userId: string;
  /** sha256 hash of the opaque session id (the raw id never touches the db). */
  sessionHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedByHash: string | null;
  userAgent: string | null;
  ip: string | null;
}
