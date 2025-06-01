/*
  Warnings:

  - Added the required column `duration` to the `roadmaps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmaps" ADD COLUMN     "duration" INTEGER NOT NULL;
