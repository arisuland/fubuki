-- CreateEnum
CREATE TYPE "ProjectHandle" AS ENUM ('Organization', 'User');

-- CreateEnum
CREATE TYPE "AuditLogTarget" AS ENUM ('Organization', 'Project');

-- CreateEnum
CREATE TYPE "AuditLogAction" AS ENUM ('ADDED_MEMBER', 'REMOVED_MEMBER', 'UPDATED_MEMBER', 'PROJECT_WENT_PRIVATE', 'PROJECT_WENT_PUBLIC', 'ADDED_WEBHOOK', 'REMOVED_WEBHOOK', 'UPDATED_WEBHOOK', 'MEMBER_ADDED_TO_ORG', 'MEMBER_REMOVED_FROM_ORG', 'MEMBER_UPDATED_PERMISSIONS');

-- CreateEnum
CREATE TYPE "ContributionState" AS ENUM ('OPENED', 'NEEDS_REVIEW', 'CLOSED', 'MERGED');

-- CreateTable
CREATE TABLE "User" (
    "twitterHandle" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT NOT NULL,
    "flags" INTEGER NOT NULL,
    "name" TEXT,
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessTokens" (
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "contributors" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "directory" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "handle" "ProjectHandle" NOT NULL,
    "flags" INTEGER NOT NULL,
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "successfulHits" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "failedHits" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "auth" TEXT,
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "permissionIds" INTEGER,
    "actionType" "AuditLogAction" NOT NULL,
    "webhookId" TEXT,
    "memberId" TEXT,
    "project" TEXT,
    "reason" TEXT,
    "target" "AuditLogTarget" NOT NULL,
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Webhook" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
