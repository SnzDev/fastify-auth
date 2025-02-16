/*
  Warnings:

  - You are about to drop the column `email_verified_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "email_verified_at",
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3);
