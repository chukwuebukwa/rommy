-- AlterTable: Add hierarchical structure to Section
ALTER TABLE "Section" ADD COLUMN "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Section" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

