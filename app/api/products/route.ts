import { NextRequest, NextResponse } from 'next/server';
import { getActiveProducts } from '@/lib/repositories/product.repository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as 'hijab' | 'plexi' | null;

    const products = await getActiveProducts(type ?? undefined);

    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
