export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCustomRequests } from '@/lib/repositories/custom-request.repository';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as any;
  const requests = await getCustomRequests(status ?? undefined);
  return NextResponse.json({ requests });
}
