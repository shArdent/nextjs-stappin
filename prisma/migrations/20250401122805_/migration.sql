/*
  Warnings:

  - Added the required column `reason` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "reason" TEXT NOT NULL;
