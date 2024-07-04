/*
  Warnings:

  - You are about to drop the column `prodTree` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "prodTree";

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventName" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "body" JSONB NOT NULL,
    "processingError" TEXT,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "lemonSqueezyId" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusFormatted" TEXT NOT NULL,
    "renewsAt" TEXT NOT NULL,
    "endsAt" TEXT NOT NULL,
    "trialEndsAt" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "isUsageBased" BOOLEAN NOT NULL DEFAULT false,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionItemId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT,
    "variantId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" TEXT NOT NULL,
    "isUsageBased" BOOLEAN NOT NULL DEFAULT false,
    "interval" TEXT,
    "intervalCount" INTEGER,
    "trialInterval" TEXT,
    "trialIntervalCount" INTEGER,
    "sort" INTEGER,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_lemonSqueezyId_key" ON "Subscription"("lemonSqueezyId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_variantId_key" ON "Plan"("variantId");
