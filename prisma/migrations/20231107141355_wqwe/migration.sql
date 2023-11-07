-- CreateTable
CREATE TABLE "QrCode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER,
    "maxUses" INTEGER DEFAULT 0,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QrCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QrCode_name_key" ON "QrCode"("name");
