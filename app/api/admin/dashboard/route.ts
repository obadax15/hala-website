import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [totalCustomRequests, pendingCustomRequests, totalProducts, totalOrders] =
    await Promise.all([
      prisma.customRequest.count({ where: { deletedAt: null } }),
      prisma.customRequest.count({ where: { deletedAt: null, status: 'SUBMITTED' } }),
      prisma.productSync.count({ where: { isActive: true } }),
      prisma.order.count({ where: { deletedAt: null } }),
    ]);

  const recentRequests = await prisma.customRequest.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, name: true, email: true, status: true, createdAt: true },
  });

  return NextResponse.json({
    stats: { totalCustomRequests, pendingCustomRequests, totalProducts, totalOrders },
    recentRequests,
  });
}
