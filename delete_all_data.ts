import { PrismaClient } from '@prisma/client';
import { createClient } from 'next-sanity';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your_sanity_project_id' ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID : 'kdwvh4r8',
  dataset: 'production',
  apiVersion: '2024-03-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  console.log('--- Deleting Postgres Data ---');
  
  try {
    // Delete in order to respect foreign keys
    await prisma.orderItem.deleteMany({});
    console.log('Deleted OrderItems');
    
    await prisma.order.deleteMany({});
    console.log('Deleted Orders');
    
    await prisma.couponUsage.deleteMany({});
    console.log('Deleted CouponUsages');
    
    await prisma.coupon.deleteMany({});
    console.log('Deleted Coupons');
    
    await prisma.wishlist.deleteMany({});
    console.log('Deleted Wishlists');
    
    await prisma.customRequest.deleteMany({});
    console.log('Deleted CustomRequests');
    
    await prisma.productSync.deleteMany({});
    console.log('Deleted ProductSyncs');
  } catch (err) {
    console.error('Failed to delete Postgres data, continuing with Sanity...', err instanceof Error ? err.message : err);
  }

  console.log('--- Deleting Sanity Data ---');
  
  const typesToDelete = [
    'product',
    'promotion',
    'coupon',
    'order',
    'homepageBanner',
    'testimonial',
    'faq',
    'customRequest'
  ];

  for (const type of typesToDelete) {
    const docs = await writeClient.fetch(`*[_type == "${type}"]{_id}`);
    console.log(`Found ${docs.length} documents of type ${type}`);
    
    if (docs.length > 0) {
      const transaction = writeClient.transaction();
      docs.forEach((doc: { _id: string }) => {
        transaction.delete(doc._id);
      });
      await transaction.commit();
      console.log(`Deleted ${docs.length} ${type} documents`);
    }
  }

  console.log('--- Finished Deleting Data ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
