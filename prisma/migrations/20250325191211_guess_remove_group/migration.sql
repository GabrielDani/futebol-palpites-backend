/*
  Warnings:

  - The primary key for the `Guess` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Guess` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_groupId_fkey";

-- DropIndex
DROP INDEX "Guess_userId_groupId_matchId_key";

-- AlterTable
ALTER TABLE "Guess" DROP CONSTRAINT "Guess_pkey",
DROP COLUMN "groupId",
DROP COLUMN "id",
ADD CONSTRAINT "Guess_pkey" PRIMARY KEY ("userId", "matchId");
