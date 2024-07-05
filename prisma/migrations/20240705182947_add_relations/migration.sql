-- AlterTable
CREATE SEQUENCE subscription_subscriptionitemid_seq;
ALTER TABLE "Subscription" ALTER COLUMN "renewsAt" DROP NOT NULL,
ALTER COLUMN "endsAt" DROP NOT NULL,
ALTER COLUMN "trialEndsAt" DROP NOT NULL,
ALTER COLUMN "subscriptionItemId" SET DEFAULT nextval('subscription_subscriptionitemid_seq');
ALTER SEQUENCE subscription_subscriptionitemid_seq OWNED BY "Subscription"."subscriptionItemId";

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
