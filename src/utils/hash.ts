import bcrypt from "bcryptjs";
import crypto from "crypto";

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
