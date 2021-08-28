-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0;
