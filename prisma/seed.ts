import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createHash } from "crypto";
import { config } from "dotenv";
import { env } from "../src/env.config";
import { encrypt } from "../src/utils/crypt.util";

config();

const prisma = new PrismaClient();

async function seed() {
  await prisma.$transaction(async (tx) => {
    const { content, tag } = encrypt(env.ADMIN_PASSWORD);
    await tx.user.create({
      data: {
        name: env.ADMIN_NAME,
        email: createHash("sha256").update(env.ADMIN_EMAIL).digest("hex"),
        emailHashed: content,
        emailTag: tag,
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
