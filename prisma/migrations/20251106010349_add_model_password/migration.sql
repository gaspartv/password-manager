/*
  Warnings:

  - You are about to drop the column `code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailHashed` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailTag` on the `users` table. All the data in the column will be lost.
  - Added the required column `email_hashed` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_tag` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_code_idx";

-- DropIndex
DROP INDEX "public"."users_code_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "code",
DROP COLUMN "emailHashed",
DROP COLUMN "emailTag",
ADD COLUMN     "email_hashed" TEXT NOT NULL,
ADD COLUMN     "email_tag" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "passwords" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "url" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "passwords_user_id_idx" ON "passwords"("user_id");

-- AddForeignKey
ALTER TABLE "passwords" ADD CONSTRAINT "passwords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
