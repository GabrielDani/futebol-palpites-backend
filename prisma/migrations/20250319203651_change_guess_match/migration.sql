/*
  Warnings:

  - You are about to drop the column `date` on the `Match` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,groupId,matchId]` on the table `Guess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchDate` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_matchId_fkey";

-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_userId_fkey";

-- AlterTable
ALTER TABLE "Guess" ADD COLUMN     "groupId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "date",
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "matchDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Guess_userId_idx" ON "Guess"("userId");

-- CreateIndex
CREATE INDEX "Guess_groupId_idx" ON "Guess"("groupId");

-- CreateIndex
CREATE INDEX "Guess_matchId_idx" ON "Guess"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "Guess_userId_groupId_matchId_key" ON "Guess"("userId", "groupId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_externalId_key" ON "Match"("externalId");

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
