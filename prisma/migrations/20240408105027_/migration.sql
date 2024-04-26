-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_allocatedById_fkey";

-- AlterTable
ALTER TABLE "StockHistory" ALTER COLUMN "allocatedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_allocatedById_fkey" FOREIGN KEY ("allocatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
