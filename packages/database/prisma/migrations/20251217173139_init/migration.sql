-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED', 'PAYMENT_FAILED');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('DOCUMENT', 'IMAGE');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ConversionType" AS ENUM ('FORMAT_CONVERSION', 'MERGE', 'SPLIT');

-- CreateEnum
CREATE TYPE "ImageOperation" AS ENUM ('FORMAT_CONVERSION', 'COMPRESS', 'RESIZE');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('DOCUMENT', 'IMAGE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'RAZORPAY', 'PAYPAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'FREE',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "password" TEXT,
    "scope" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT '',
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "dailyDocumentLimit" INTEGER NOT NULL,
    "dailyImageLimit" INTEGER NOT NULL,
    "mergeFileLimit" INTEGER NOT NULL,
    "storageLimitMB" INTEGER NOT NULL,
    "retentionDays" INTEGER NOT NULL,
    "description" TEXT,
    "features" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "provider" "PaymentProvider" NOT NULL DEFAULT 'RAZORPAY',
    "providerSubscriptionId" TEXT,
    "providerCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guestUsage" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "fingerprint" TEXT,
    "userAgent" TEXT,
    "documentCount" INTEGER NOT NULL DEFAULT 0,
    "imageCount" INTEGER NOT NULL DEFAULT 0,
    "mergeCount" INTEGER NOT NULL DEFAULT 0,
    "lastResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guestUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentCount" INTEGER NOT NULL DEFAULT 0,
    "imageCount" INTEGER NOT NULL DEFAULT 0,
    "mergeCount" INTEGER NOT NULL DEFAULT 0,
    "lifetimeDocumentCount" INTEGER NOT NULL DEFAULT 0,
    "lifetimeImageCount" INTEGER NOT NULL DEFAULT 0,
    "lastResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestUsageId" TEXT,
    "originalFileName" TEXT NOT NULL,
    "originalFormat" TEXT NOT NULL,
    "targetFormat" TEXT,
    "fileSize" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "conversionType" "ConversionType" NOT NULL,
    "processedS3Key" TEXT,
    "processedFileSize" INTEGER,
    "processingError" TEXT,
    "processingStartedAt" TIMESTAMP(3),
    "processingCompletedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "planSnapshot" TEXT NOT NULL,
    "batchId" TEXT,
    "additionalInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestUsageId" TEXT,
    "originalFileName" TEXT NOT NULL,
    "originalFormat" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "operation" "ImageOperation" NOT NULL,
    "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "targetFormat" TEXT,
    "targetWidth" INTEGER,
    "targetHeight" INTEGER,
    "compressionQuality" INTEGER,
    "processedS3Key" TEXT,
    "processedFileSize" INTEGER,
    "processedWidth" INTEGER,
    "processedHeight" INTEGER,
    "processingError" TEXT,
    "processingStartedAt" TIMESTAMP(3),
    "processingCompletedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "planSnapshot" TEXT NOT NULL,
    "batchId" TEXT,
    "additionalInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentMerge" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "mergedId" TEXT NOT NULL,
    "mergeOrder" INTEGER NOT NULL,

    CONSTRAINT "documentMerge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "guestUsageId" TEXT,
    "resourceType" "ResourceType" NOT NULL,
    "resourceId" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetPeriod" TEXT NOT NULL,

    CONSTRAINT "usageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "task" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "data" JSONB NOT NULL,
    "result" JSONB,
    "error" TEXT,
    "userId" TEXT,
    "guestUsageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "provider" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT,
    "providerOrderId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventId" TEXT,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_identifier_key" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptionPlan_name_key" ON "subscriptionPlan"("name");

-- CreateIndex
CREATE INDEX "subscriptionPlan_name_idx" ON "subscriptionPlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_key" ON "subscription"("userId");

-- CreateIndex
CREATE INDEX "subscription_userId_idx" ON "subscription"("userId");

-- CreateIndex
CREATE INDEX "subscription_planId_idx" ON "subscription"("planId");

-- CreateIndex
CREATE INDEX "guestUsage_ipAddress_idx" ON "guestUsage"("ipAddress");

-- CreateIndex
CREATE INDEX "guestUsage_lastResetAt_idx" ON "guestUsage"("lastResetAt");

-- CreateIndex
CREATE UNIQUE INDEX "guestUsage_ipAddress_fingerprint_key" ON "guestUsage"("ipAddress", "fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "UserUsage_userId_key" ON "UserUsage"("userId");

-- CreateIndex
CREATE INDEX "UserUsage_userId_idx" ON "UserUsage"("userId");

-- CreateIndex
CREATE INDEX "document_userId_idx" ON "document"("userId");

-- CreateIndex
CREATE INDEX "document_guestUsageId_idx" ON "document"("guestUsageId");

-- CreateIndex
CREATE INDEX "document_status_idx" ON "document"("status");

-- CreateIndex
CREATE INDEX "document_expiresAt_idx" ON "document"("expiresAt");

-- CreateIndex
CREATE INDEX "document_createdAt_idx" ON "document"("createdAt");

-- CreateIndex
CREATE INDEX "image_userId_idx" ON "image"("userId");

-- CreateIndex
CREATE INDEX "image_guestUsageId_idx" ON "image"("guestUsageId");

-- CreateIndex
CREATE INDEX "image_status_idx" ON "image"("status");

-- CreateIndex
CREATE INDEX "image_expiresAt_idx" ON "image"("expiresAt");

-- CreateIndex
CREATE INDEX "image_createdAt_idx" ON "image"("createdAt");

-- CreateIndex
CREATE INDEX "documentMerge_documentId_idx" ON "documentMerge"("documentId");

-- CreateIndex
CREATE INDEX "documentMerge_mergedId_idx" ON "documentMerge"("mergedId");

-- CreateIndex
CREATE UNIQUE INDEX "documentMerge_documentId_mergeOrder_key" ON "documentMerge"("documentId", "mergeOrder");

-- CreateIndex
CREATE INDEX "usageLog_userId_timestamp_idx" ON "usageLog"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "usageLog_guestUsageId_timestamp_idx" ON "usageLog"("guestUsageId", "timestamp");

-- CreateIndex
CREATE INDEX "usageLog_timestamp_idx" ON "usageLog"("timestamp");

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE INDEX "Job_guestUsageId_idx" ON "Job"("guestUsageId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerPaymentId_key" ON "Payment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_providerPaymentId_idx" ON "Payment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "Payment_providerOrderId_idx" ON "Payment"("providerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_eventId_key" ON "WebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_eventType_idx" ON "WebhookEvent"("provider", "eventType");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUsage" ADD CONSTRAINT "UserUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_guestUsageId_fkey" FOREIGN KEY ("guestUsageId") REFERENCES "guestUsage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_guestUsageId_fkey" FOREIGN KEY ("guestUsageId") REFERENCES "guestUsage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentMerge" ADD CONSTRAINT "documentMerge_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentMerge" ADD CONSTRAINT "documentMerge_mergedId_fkey" FOREIGN KEY ("mergedId") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usageLog" ADD CONSTRAINT "usageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_guestUsageId_fkey" FOREIGN KEY ("guestUsageId") REFERENCES "guestUsage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
