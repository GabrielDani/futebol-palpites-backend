/*
  Warnings:

  - You are about to drop the column `awayTeam` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeam` on the `Match` table. All the data in the column will be lost.
  - Added the required column `awayTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Match_externalId_key";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "awayTeam",
DROP COLUMN "externalId",
DROP COLUMN "homeTeam",
ADD COLUMN     "awayTeamId" TEXT NOT NULL,
ADD COLUMN     "homeTeamId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
