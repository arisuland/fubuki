/*
  Warnings:

  - You are about to drop the column `projectId` on the `project_languages` table. All the data in the column will be lost.
  - Added the required column `projectsId` to the `project_languages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_languages" DROP CONSTRAINT "project_languages_projectId_fkey";

-- AlterTable
ALTER TABLE "project_languages" DROP COLUMN "projectId",
ADD COLUMN     "projectsId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "project_languages" ADD CONSTRAINT "project_languages_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
