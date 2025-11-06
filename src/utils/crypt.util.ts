import crypto from "crypto";

export async function deriveKey(
  masterPassword: string,
  salt: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      masterPassword,
      salt,
      32,
      { N: 16384, r: 8, p: 1 },
      (err, key) => {
        if (err) reject(err);
        else resolve(key as Buffer);
      },
    );
  });
}

export async function encrypt(plainText: string, key: Buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  console.log({
    iv,
    key: key.toString("hex"),
  });
  const tag = cipher.getAuthTag();
  return {
    data: Buffer.concat([encrypted, tag]).toString("base64"),
    iv: iv.toString("base64"),
  };
}

export async function decrypt(encData: string, ivBase64: string, key: Buffer) {
  const data = Buffer.from(encData, "base64");
  const iv = Buffer.from(ivBase64, "base64");
  console.log({ iv, key: key.toString("hex") });
  const tag = data.slice(data.length - 16);
  const text = data.slice(0, data.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(text), decipher.final()]);

  return decrypted.toString("utf8");
}
