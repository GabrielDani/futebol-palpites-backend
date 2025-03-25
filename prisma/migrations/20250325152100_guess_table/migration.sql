/*
  Warnings:

  - You are about to drop the column `round` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Guess` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Guess_groupId_idx";

-- DropIndex
DROP INDEX "Guess_matchId_idx";

-- DropIndex
DROP INDEX "Guess_userId_idx";

-- AlterTable
ALTER TABLE "Guess" DROP COLUMN "round",
DROP COLUMN "status";
