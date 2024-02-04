/*
  Warnings:

  - You are about to drop the column `stockId` on the `resources` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "resources_stockId_key";

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "stockId";
