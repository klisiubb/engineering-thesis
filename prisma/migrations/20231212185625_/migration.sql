/*
  Warnings:

  - You are about to drop the column `isPresentAtWorkshop` on the `User` table. All the data in the column will be lost.
  - Made the column `maxAttenders` on table `Workshop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPresentAtWorkshop";

-- AlterTable
ALTER TABLE "Workshop" ALTER COLUMN "maxAttenders" SET NOT NULL,
ALTER COLUMN "maxAttenders" SET DEFAULT 9999;
