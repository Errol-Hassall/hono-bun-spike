/*
  Warnings:

  - You are about to drop the column `documents` on the `Itinerary` table. All the data in the column will be lost.
  - Added the required column `documentId` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "documents",
ADD COLUMN     "documentId" TEXT NOT NULL;
