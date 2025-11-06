/*
  Warnings:

  - You are about to drop the column `iv` on the `passwords` table. All the data in the column will be lost.
  - Added the required column `password_iv` to the `passwords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_tag` to the `passwords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_iv` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passwords" DROP COLUMN "iv",
ADD COLUMN     "password_iv" TEXT NOT NULL,
ADD COLUMN     "password_tag" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_iv" TEXT NOT NULL;
