-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authProvider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "radars" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "quadrants" JSONB NOT NULL,
    "rings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "radars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_items" (
    "id" TEXT NOT NULL,
    "radarId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quadrant" INTEGER NOT NULL,
    "ring" INTEGER NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tech_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "radars_shareToken_key" ON "radars"("shareToken");

-- CreateIndex
CREATE INDEX "radars_shareToken_idx" ON "radars"("shareToken");

-- CreateIndex
CREATE INDEX "radars_ownerId_idx" ON "radars"("ownerId");

-- CreateIndex
CREATE INDEX "tech_items_radarId_idx" ON "tech_items"("radarId");

-- AddForeignKey
ALTER TABLE "radars" ADD CONSTRAINT "radars_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_items" ADD CONSTRAINT "tech_items_radarId_fkey" FOREIGN KEY ("radarId") REFERENCES "radars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
