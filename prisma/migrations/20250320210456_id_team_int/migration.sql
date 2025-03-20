/*
  Warnings:

  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Team` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `awayTeamId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `homeTeamId` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_homeTeamId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "awayTeamId",
ADD COLUMN     "awayTeamId" INTEGER NOT NULL,
DROP COLUMN "homeTeamId",
ADD COLUMN     "homeTeamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
