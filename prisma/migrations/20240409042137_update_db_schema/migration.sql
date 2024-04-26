/*
  Warnings:

  - You are about to drop the `StockHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StockAllocationStatus" AS ENUM ('Registered', 'Approved', 'Rejected', 'Returned', 'Overdue');

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_allocatedById_fkey";

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_allocatedToId_fkey";

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "StockHistory" DROP CONSTRAINT "StockHistory_stockId_fkey";

-- DropTable
DROP TABLE "StockHistory";

-- CreateTable
CREATE TABLE "stockAllocation" (
    "id" TEXT NOT NULL,
    "status" "StockAllocationStatus" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "otp" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "otpGeneratedAt" TIMESTAMP(3),
    "allocatedToId" TEXT NOT NULL,
    "allocatedById" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "collegeId" TEXT,
    "resourceId" TEXT,

    CONSTRAINT "stockAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockAllocationHistory" (
    "id" TEXT NOT NULL,
    "action" "StockAllocationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockAllocationId" TEXT NOT NULL,

    CONSTRAINT "StockAllocationHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stockAllocation" ADD CONSTRAINT "stockAllocation_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockAllocation" ADD CONSTRAINT "stockAllocation_allocatedToId_fkey" FOREIGN KEY ("allocatedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockAllocation" ADD CONSTRAINT "stockAllocation_allocatedById_fkey" FOREIGN KEY ("allocatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockAllocation" ADD CONSTRAINT "stockAllocation_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockAllocation" ADD CONSTRAINT "stockAllocation_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockAllocationHistory" ADD CONSTRAINT "StockAllocationHistory_stockAllocationId_fkey" FOREIGN KEY ("stockAllocationId") REFERENCES "stockAllocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
