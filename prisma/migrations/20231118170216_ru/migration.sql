-- CreateTable
CREATE TABLE "_ScannedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ScannedBy_AB_unique" ON "_ScannedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_ScannedBy_B_index" ON "_ScannedBy"("B");

-- AddForeignKey
ALTER TABLE "_ScannedBy" ADD CONSTRAINT "_ScannedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "QrCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScannedBy" ADD CONSTRAINT "_ScannedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
