import { getAllProducts } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const isAr = params.locale === 'ar';
  return {
    title: isAr ? 'المنتجات | Halahello' : 'Products | Halahello',
    description: isAr ? 'تصفح جميع منتجاتنا' : 'Browse all our products',
  };
}

export default async function ProductsPage({ params }: { params: { locale: string } }) {
  const isAr = params.locale === 'ar';
  // Fetching all products
  const products = await getAllProducts();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(params.locale, {
      style: 'currency',
      currency: 'SYP',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.25rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 600, textAlign: 'center', marginBottom: '3rem' }}>
        {isAr ? 'جميع المنتجات' : 'All Products'}
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem',
        }}
      >
        {products.map((product) => {
          const title = isAr && product.titleAr ? product.titleAr : product.title;
          const displayPrice = product.discountPrice ?? product.price;

          return (
            <Link
              key={product._id}
              href={`/${params.locale}/products/${product.sanityId}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4/5',
                  backgroundColor: 'var(--image-bg, #f5f5f5)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={product.imageUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.5rem' }}>{title}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600 }}>{formatPrice(displayPrice)}</span>
                  {product.discountPrice && product.discountPrice < product.price && (
                    <span style={{ textDecoration: 'line-through', color: '#737373', fontSize: '0.9rem' }}>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
