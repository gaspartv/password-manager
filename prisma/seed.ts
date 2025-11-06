import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createHash } from "crypto";
import cuid from "cuid";
import { config } from "dotenv";
import { env } from "../src/env.config";
import { deriveKey, encrypt } from "../src/utils/crypt.util";

config();

const prisma = new PrismaClient();

async function seed() {
  await prisma.$transaction(async (tx) => {
    const salt = cuid();
    const key = await deriveKey(env.CRYPT_KEY, salt);

    const { data, iv } = await encrypt(env.ADMIN_EMAIL, key);

    await tx.user.create({
      data: {
        name: env.ADMIN_NAME,
        email: createHash("sha256").update(env.ADMIN_EMAIL).digest("hex"),
        emailEnc: data,
        emailIv: iv,
        password: bcrypt.hashSync(
          env.ADMIN_PASSWORD,
          env.BCRYPT_HASH_SALT_ROUNDS,
        ),
      },
    });
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
