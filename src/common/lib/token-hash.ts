import { createHash, randomBytes } from "node:crypto";

export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

/** Opaque, high-entropy session id. Only its hash is persisted server-side. */
export const generateSessionId = (): string =>
  randomBytes(32).toString("hex");
