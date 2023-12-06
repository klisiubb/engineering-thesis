/*
  Warnings:

  - You are about to drop the column `userId` on the `Reward` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_userId_fkey";

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_RewardWinners" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RewardWinners_AB_unique" ON "_RewardWinners"("A", "B");

-- CreateIndex
CREATE INDEX "_RewardWinners_B_index" ON "_RewardWinners"("B");

-- AddForeignKey
ALTER TABLE "_RewardWinners" ADD CONSTRAINT "_RewardWinners_A_fkey" FOREIGN KEY ("A") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RewardWinners" ADD CONSTRAINT "_RewardWinners_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
