import crypto from "crypto";
import { env } from "../env.config";

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    env.CRYPT_KEY,
    env.CRYPT_IV,
  );
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    content: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  };
}

export function decrypt(encrypted: { content: string; tag: string }) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    env.CRYPT_KEY,
    Buffer.from(env.CRYPT_IV, "hex"),
  );
  decipher.setAuthTag(Buffer.from(encrypted.tag, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
