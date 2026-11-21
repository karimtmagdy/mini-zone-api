import crypto from "node:crypto";

export const generateCode = (prefix: string = "SALE") => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${random}`;
};
