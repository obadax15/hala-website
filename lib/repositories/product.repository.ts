import prisma from '../prisma';

export type ProductType = 'hijab' | 'plexi';

export interface ProductWithMeta {
  id: string;
  sanityId: string;
  price: number;
  stock: number;
  isActive: boolean;
}

/**
 * Returns all active products, optionally filtered by type prefix on sanityId.
 * Convention: sanityId format = "hijab-slug" or "plexi-slug"
 */
export async function getActiveProducts(type?: ProductType): Promise<ProductWithMeta[]> {
  const where: { isActive: boolean; sanityId?: { startsWith: string } } = { isActive: true };
  if (type) {
    where.sanityId = { startsWith: type };
  }
  return prisma.productSync.findMany({
    where,
    select: { id: true, sanityId: true, price: true, stock: true, isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getProductBySanityId(sanityId: string): Promise<ProductWithMeta | null> {
  return prisma.productSync.findUnique({
    where: { sanityId },
    select: { id: true, sanityId: true, price: true, stock: true, isActive: true },
  });
}

export async function upsertProduct(data: {
  sanityId: string;
  price: number;
  stock: number;
}): Promise<ProductWithMeta> {
  return prisma.productSync.upsert({
    where: { sanityId: data.sanityId },
    update: { price: data.price, stock: data.stock },
    create: { sanityId: data.sanityId, price: data.price, stock: data.stock },
    select: { id: true, sanityId: true, price: true, stock: true, isActive: true },
  });
}
