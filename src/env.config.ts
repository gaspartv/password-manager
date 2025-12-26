import { Logger } from "@nestjs/common";
import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  API_NAME: z.string(),
  FRONT_URL: z.url(),

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

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.email(),
  SMTP_PASS: z.string().min(1),
  MAIL_FROM_NAME: z.string().optional(),
  MAIL_FROM_ADDRESS: z.email().optional(),
  SMTP_VERIFY_ON_BOOT: z.coerce.boolean().default(true),
  SMTP_DEBUG: z.coerce.boolean().default(false),
  SMTP_AUTH_METHOD: z.enum(["LOGIN", "PLAIN", "CRAM-MD5"]).optional(),
  SMTP_TLS_REJECT_UNAUTHORIZED: z.coerce.boolean().default(true),
  SMTP_REQUIRE_TLS: z.coerce.boolean().default(false),
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
