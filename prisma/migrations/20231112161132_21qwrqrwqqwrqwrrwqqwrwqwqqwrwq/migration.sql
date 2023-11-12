/*
  Warnings:

  - Made the column `maxUses` on table `QrCode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "QrCode" ALTER COLUMN "maxUses" SET NOT NULL;
