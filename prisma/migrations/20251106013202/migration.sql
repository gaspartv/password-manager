/*
  Warnings:

  - You are about to drop the column `password` on the `passwords` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iv` to the `passwords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_enc` to the `passwords` table without a default value. This is not possible if the table is not empty.
  - The required column `code` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "passwords" DROP COLUMN "password",
ADD COLUMN     "iv" TEXT NOT NULL,
ADD COLUMN     "password_enc" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_code_key" ON "users"("code");
