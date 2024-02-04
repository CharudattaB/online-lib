/*
  Warnings:

  - You are about to drop the column `addrtess` on the `colleges` table. All the data in the column will be lost.
  - Added the required column `address` to the `colleges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "colleges" DROP COLUMN "addrtess",
ADD COLUMN     "address" TEXT NOT NULL;
