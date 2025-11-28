/*
  Warnings:

  - You are about to drop the column `caption` on the `entry_images` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `entry_images` table. All the data in the column will be lost.
  - You are about to drop the `entry_text` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `body` to the `entries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "entry_text" DROP CONSTRAINT "entry_text_entryId_fkey";

-- AlterTable
ALTER TABLE "entries" ADD COLUMN     "body" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "entry_images" DROP COLUMN "caption",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "entry_links" ALTER COLUMN "subtype" DROP NOT NULL,
ALTER COLUMN "subtype" DROP DEFAULT;

-- DropTable
DROP TABLE "entry_text";
