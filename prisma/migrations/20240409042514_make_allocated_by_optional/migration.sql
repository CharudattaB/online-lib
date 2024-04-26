-- DropForeignKey
ALTER TABLE "stockAllocation" DROP CONSTRAINT "stockAllocation_allocatedById_fkey";

-- AlterTable
ALTER TABLE "stockAllocation" ALTER COLUMN "allocatedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "stockAllocation" ADD CONSTRAINT "stockAllocation_allocatedById_fkey" FOREIGN KEY ("allocatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
