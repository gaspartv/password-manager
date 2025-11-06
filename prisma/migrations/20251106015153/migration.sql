/*
  Warnings:

  - You are about to drop the column `email_hashed` on the `users` table. All the data in the column will be lost.
  - Added the required column `email_enc` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_hashed",
ADD COLUMN     "email_enc" TEXT NOT NULL;
