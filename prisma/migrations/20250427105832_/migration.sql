/*
  Warnings:

  - Added the required column `startAt` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;
