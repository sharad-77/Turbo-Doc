import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding subscription plans...');

  // FREE Plan
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'FREE' },
    update: {},
    create: {
      name: 'FREE',
      displayName: 'Free Plan',
      price: 0,
      currency: 'INR',
      dailyDocumentLimit: 5,
      dailyImageLimit: 5,
      mergeFileLimit: 2,
      storageLimitMB: 200,
      retentionDays: 7,
      description: 'Perfect for personal use and light document processing',
      features: [
        '5 document conversions per day',
        '5 image conversions per day',
        '2 file merges per day',
        '200MB storage',
        '7-day file retention',
        'Basic formats supported',
        'Email support',
      ],
      isActive: true,
    },
  });

  // PRO Plan
  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'PRO' },
    update: {},
    create: {
      name: 'PRO',
      displayName: 'Pro Plan',
      price: 249,
      currency: 'INR',
      dailyDocumentLimit: 20,
      dailyImageLimit: 20,
      mergeFileLimit: -1, // unlimited
      storageLimitMB: 500,
      retentionDays: 30,
      description: 'Ideal for professionals and small teams',
      features: [
        '20 document conversions per day',
        '20 image conversions per day',
        'Unlimited file merges',
        '500MB storage',
        '30-day file retention',
        'All formats supported',
        'Priority processing',
        'Advanced features (merge, split, watermark)',
        'Priority support',
      ],
      isActive: true,
    },
  });

  console.log('✅ Created plans:', { freePlan, proPlan });
}

main()
  .catch(e => {
    console.error('Error seeding plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
