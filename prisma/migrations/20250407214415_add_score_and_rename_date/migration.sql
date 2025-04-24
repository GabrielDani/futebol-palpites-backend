/*
  Warnings:

  - You are about to drop the column `matchDate` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "matchDate",
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "scoreAway" INTEGER,
ADD COLUMN     "scoreHome" INTEGER;
