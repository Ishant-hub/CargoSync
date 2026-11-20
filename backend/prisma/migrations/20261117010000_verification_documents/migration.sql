-- AlterEnum
ALTER TYPE "VerificationStatus" ADD VALUE IF NOT EXISTS 'NOT_SUBMITTED';
ALTER TYPE "VerificationStatus" ADD VALUE IF NOT EXISTS 'UNDER_REVIEW';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationStatus" SET DEFAULT 'NOT_SUBMITTED';

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "verificationStatus" SET DEFAULT 'NOT_SUBMITTED';

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('AADHAAR', 'DRIVING_LICENCE', 'PAN', 'RC', 'GST_CERTIFICATE', 'INCORPORATION', 'BANK_STATEMENT');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'CORRECTION_REQUIRED');

-- CreateTable
CREATE TABLE "VerificationDocument" (
    "id" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "type" "DocumentType" NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'SUBMITTED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "reviewRemarks" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "companyId" TEXT,
    "uploadedById" TEXT NOT NULL,
    "reviewedById" TEXT,

    CONSTRAINT "VerificationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationAuditLog" (
    "id" TEXT NOT NULL,
    "entityType" "DocumentCategory" NOT NULL,
    "entityId" TEXT NOT NULL,
    "previousStatus" "VerificationStatus" NOT NULL,
    "newStatus" "VerificationStatus" NOT NULL,
    "remarks" TEXT,
    "performedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationDocument_s3Key_key" ON "VerificationDocument"("s3Key");
CREATE INDEX "VerificationDocument_userId_idx" ON "VerificationDocument"("userId");
CREATE INDEX "VerificationDocument_companyId_idx" ON "VerificationDocument"("companyId");
CREATE INDEX "VerificationDocument_type_idx" ON "VerificationDocument"("type");
CREATE INDEX "VerificationDocument_status_idx" ON "VerificationDocument"("status");
CREATE INDEX "VerificationDocument_category_idx" ON "VerificationDocument"("category");

CREATE INDEX "VerificationAuditLog_entityId_idx" ON "VerificationAuditLog"("entityId");
CREATE INDEX "VerificationAuditLog_entityType_idx" ON "VerificationAuditLog"("entityType");
CREATE INDEX "VerificationAuditLog_performedById_idx" ON "VerificationAuditLog"("performedById");

-- AddForeignKey
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationAuditLog" ADD CONSTRAINT "VerificationAuditLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
