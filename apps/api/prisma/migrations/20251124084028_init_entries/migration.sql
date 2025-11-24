-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('text', 'image', 'link');

-- CreateTable
CREATE TABLE "entries" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "EntryType" NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_text" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "entryId" INTEGER NOT NULL,

    CONSTRAINT "entry_text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "entryId" INTEGER NOT NULL,

    CONSTRAINT "entry_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_links" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "resolvedTitle" TEXT,
    "resolvedDesc" TEXT,
    "resolvedImage" TEXT,
    "subtype" TEXT NOT NULL DEFAULT '',
    "entryId" INTEGER NOT NULL,

    CONSTRAINT "entry_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entries_slug_key" ON "entries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "entry_text_entryId_key" ON "entry_text"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "entry_images_entryId_key" ON "entry_images"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "entry_links_entryId_key" ON "entry_links"("entryId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "entry_text" ADD CONSTRAINT "entry_text_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_images" ADD CONSTRAINT "entry_images_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_links" ADD CONSTRAINT "entry_links_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
