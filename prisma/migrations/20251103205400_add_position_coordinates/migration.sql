-- AlterTable
ALTER TABLE "tech_items" ADD COLUMN     "positionX" DOUBLE PRECISION,
ADD COLUMN     "positionY" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "radars_updatedAt_idx" ON "radars"("updatedAt");
