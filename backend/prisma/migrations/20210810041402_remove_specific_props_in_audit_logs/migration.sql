/*
  Warnings:

  - You are about to drop the column `memberId` on the `AuditLogs` table. All the data in the column will be lost.
  - You are about to drop the column `permissionIds` on the `AuditLogs` table. All the data in the column will be lost.
  - You are about to drop the column `webhookId` on the `AuditLogs` table. All the data in the column will be lost.
  - Made the column `project` on table `AuditLogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AuditLogs" DROP COLUMN "memberId",
DROP COLUMN "permissionIds",
DROP COLUMN "webhookId",
ALTER COLUMN "project" SET NOT NULL;
