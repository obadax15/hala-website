import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const coupons = await prisma.coupon.findMany();
  console.log(coupons);
}

main().catch(console.error).finally(() => prisma.$disconnect());
