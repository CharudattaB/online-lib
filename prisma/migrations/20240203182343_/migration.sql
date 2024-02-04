/*
  Warnings:

  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[resourceId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_resourceId_fkey";

-- DropTable
DROP TABLE "books";

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "author" TEXT NOT NULL,
    "publicationName" TEXT,
    "edition" TEXT,
    "publishedYear" TIMESTAMP(3),
    "language" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "isDigital" BOOLEAN NOT NULL,
    "meta" JSONB NOT NULL,
    "tags" TEXT[],
    "trendIndex" INTEGER NOT NULL DEFAULT 0,
    "coverImage" TEXT DEFAULT '/default_book.png',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resources_isbn_key" ON "resources"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "resources_stockId_key" ON "resources"("stockId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_resourceId_key" ON "Stock"("resourceId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
