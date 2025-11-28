/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `entries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "entries_title_key" ON "entries"("title");
