/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Project` table. All the data in the column will be lost.
  - Added the required column `ownerID` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "owner_id",
ADD COLUMN     "ownerID" TEXT NOT NULL;
