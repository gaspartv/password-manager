import { Logger } from "@nestjs/common";
import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.string().transform((val) => Number(val)),

  DATABASE_URL: z.string(),

  ADMIN_NAME: z.string(),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string(),

  CRYPT_KEY: z.string(),
  CRYPT_ALGORITHM: z.string(),

  BCRYPT_HASH_SALT_ROUNDS: z.string().transform((val) => Number(val)),

  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.coerce.number().min(0).max(86400000),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  Logger.error(
    "❌ Invalid environment variables",
    JSON.stringify(_env.error.format(), null, 2),
  );

  process.exit(1);
}

const env = _env.data;

export { env };
