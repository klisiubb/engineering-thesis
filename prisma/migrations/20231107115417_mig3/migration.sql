/*
  Warnings:

  - You are about to drop the column `Count` on the `Reward` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "Count",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 1;
