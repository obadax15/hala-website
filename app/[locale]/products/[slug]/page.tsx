import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/sanity/lib/queries';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { CustomizationForm } from '@/components/product/CustomizationForm';
import styles from './page.module.css';

interface ProductPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  const title = params.locale === 'ar' && product.titleAr ? product.titleAr : product.title;
  const description = params.locale === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;

  return {
    title: product.metaTitle || `${title} | Halahello`,
    description: product.metaDescription || description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = params;
  const isAr = locale === 'ar';

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch DB ID for checkout cart sync
  const dbProduct = await prisma.productSync.findUnique({
    where: { sanityId: slug },
    select: { id: true, stock: true },
  });

  const allImages = [product.imageUrl, ...(product.galleryUrls || [])].filter(Boolean) as string[];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'SYP',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.productLayout}>
        <div className={styles.gallerySection}>
          <ProductGallery
            images={allImages}
            productTitle={isAr && product.titleAr ? product.titleAr : product.title}
          />
        </div>

        <div className={styles.infoSection}>
          <ProductInfo product={product} />
          
          {dbProduct ? (
            <CustomizationForm product={product} dbProductId={dbProduct.id} />
          ) : (
            <div style={{ padding: '1.5rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px' }}>
              {isAr 
                ? 'هذا المنتج غير متوفر حالياً (خطأ في المزامنة)' 
                : 'This product is currently unavailable (sync error).'}
            </div>
          )}
        </div>
      </div>

      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.sectionTitle}>
            {isAr ? 'قد يعجبك أيضاً' : 'You May Also Like'}
          </h2>
          <div className={styles.relatedGrid}>
            {product.relatedProducts.map((related) => {
              const relTitle = isAr && related.titleAr ? related.titleAr : related.title;
              return (
                <Link key={related._id} href={`/${locale}/products/${related.sanityId}`} className={styles.relatedCard}>
                  <div className={styles.relatedImageWrapper}>
                    <Image
                      src={related.imageUrl}
                      alt={relTitle}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={styles.relatedImage}
                    />
                  </div>
                  <div>
                    <h3 className={styles.relatedTitle}>{relTitle}</h3>
                    <p className={styles.relatedPrice}>
                      {formatPrice(related.discountPrice ?? related.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
