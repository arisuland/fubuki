-- CreateTable
CREATE TABLE "project_languages" (
    "completed" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "project_languages_code_key" ON "project_languages"("code");

-- AddForeignKey
ALTER TABLE "project_languages" ADD CONSTRAINT "project_languages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
