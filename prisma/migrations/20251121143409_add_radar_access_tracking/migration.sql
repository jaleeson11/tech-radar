-- CreateTable
CREATE TABLE "radar_accesses" (
    "id" TEXT NOT NULL,
    "radarId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastViewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "radar_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "radar_accesses_userId_idx" ON "radar_accesses"("userId");

-- CreateIndex
CREATE INDEX "radar_accesses_radarId_idx" ON "radar_accesses"("radarId");

-- CreateIndex
CREATE UNIQUE INDEX "radar_accesses_radarId_userId_key" ON "radar_accesses"("radarId", "userId");

-- AddForeignKey
ALTER TABLE "radar_accesses" ADD CONSTRAINT "radar_accesses_radarId_fkey" FOREIGN KEY ("radarId") REFERENCES "radars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radar_accesses" ADD CONSTRAINT "radar_accesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
