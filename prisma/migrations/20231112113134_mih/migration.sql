/*
  Warnings:

  - You are about to drop the column `currentUses` on the `QrCode` table. All the data in the column will be lost.
  - You are about to drop the column `currentAttenders` on the `Workshop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QrCode" DROP COLUMN "currentUses";

-- AlterTable
ALTER TABLE "Workshop" DROP COLUMN "currentAttenders";
