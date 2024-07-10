/*
  Warnings:

  - Made the column `address` on table `UserAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserAddress" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "address2" DROP NOT NULL;
