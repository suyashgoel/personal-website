/*
  Warnings:

  - The values [text,link] on the enum `EntryType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `entry_links` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EntryType_new" AS ENUM ('image');
ALTER TABLE "entries" ALTER COLUMN "type" TYPE "EntryType_new" USING ("type"::text::"EntryType_new");
ALTER TYPE "EntryType" RENAME TO "EntryType_old";
ALTER TYPE "EntryType_new" RENAME TO "EntryType";
DROP TYPE "public"."EntryType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "entry_links" DROP CONSTRAINT "entry_links_entryId_fkey";

-- DropTable
DROP TABLE "entry_links";
