/*
  Warnings:

  - A unique constraint covering the columns `[qrCodeId]` on the table `Workshop` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "QrCode" ADD COLUMN     "workshopId" TEXT;

-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPresentAtEvent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPresentAtWorkshop" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWinner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workshopToAttendId" TEXT,
ADD COLUMN     "workshopToLectureId" TEXT;

-- AlterTable
ALTER TABLE "Workshop" ADD COLUMN     "qrCodeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_qrCodeId_key" ON "Workshop"("qrCodeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workshopToAttendId_fkey" FOREIGN KEY ("workshopToAttendId") REFERENCES "Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workshopToLectureId_fkey" FOREIGN KEY ("workshopToLectureId") REFERENCES "Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "QrCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("externalId") ON DELETE SET NULL ON UPDATE CASCADE;
