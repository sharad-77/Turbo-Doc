import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not defined');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('📋 Seeding subscription plans...');

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
      description: 'Perfect for trying out Turbo-Doc with basic needs.',
      features: [
        '5 document conversions/day',
        '5 image conversions/day',
        '2 file merges/day',
        '200MB storage',
        '7-day retention',
      ],
      isActive: true,
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { name: 'PRO' },
    update: {},
    create: {
      name: 'PRO',
      displayName: 'Pro Plan',
      price: 249, // Monthly price
      currency: 'INR',
      dailyDocumentLimit: 20,
      dailyImageLimit: 20,
      mergeFileLimit: -1, // -1 means unlimited
      storageLimitMB: 500,
      retentionDays: 30,
      description: 'For professionals who need more power and speed.',
      features: [
        '20 document conversions/day',
        '20 image conversions/day',
        'Unlimited file merges',
        '500MB storage',
        '30-day retention',
        'Priority Support',
        'No Watermarks',
      ],
      isActive: true,
    },
  });

  console.log('✅ Created FREE plan:', freePlan.name);
  console.log('✅ Created PRO plan:', proPlan.name);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
