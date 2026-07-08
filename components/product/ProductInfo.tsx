'use client';

import { useState } from 'react';
import { SanityProduct } from '@/sanity/lib/queries';
import styles from './ProductInfo.module.css';
import { useLocale } from 'next-intl';

interface ProductInfoProps {
  product: SanityProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true, // open by default
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const title = isAr && product.titleAr ? product.titleAr : product.title;
  const description = isAr && product.descriptionAr ? product.descriptionAr : product.description;
  const deliveryInfo = isAr && product.deliveryInfoAr ? product.deliveryInfoAr : product.deliveryInfo;
  const returnPolicy = isAr && product.returnPolicyAr ? product.returnPolicyAr : product.returnPolicy;

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'SYP',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={styles.container}>
      {/* Badges */}
      <div className={styles.badges}>
        {product.isNew && (
          <span className={`${styles.badge} ${styles.badgeNew}`}>
            {isAr ? 'جديد' : 'New'}
          </span>
        )}
        {product.isBestSeller && (
          <span className={`${styles.badge} ${styles.badgeBestSeller}`}>
            {isAr ? 'الأكثر مبيعاً' : 'Best Seller'}
          </span>
        )}
        {product.isFeatured && (
          <span className={`${styles.badge} ${styles.badgeFeatured}`}>
            {isAr ? 'مميز' : 'Featured'}
          </span>
        )}
      </div>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.priceContainer}>
        {product.discountPrice && product.discountPrice < product.price ? (
          <>
            <span className={styles.price}>{formatPrice(product.discountPrice)}</span>
            <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
          </>
        ) : (
          <span className={styles.price}>{formatPrice(product.price)}</span>
        )}
      </div>

      {description && <p className={styles.description}>{description}</p>}

      <hr className={styles.divider} />

      <div className={styles.accordion}>
        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className={styles.accordionItem}>
            <button
              className={styles.accordionHeader}
              onClick={() => toggleSection('specs')}
              aria-expanded={openSections['specs']}
            >
              {isAr ? 'المواصفات' : 'Specifications'}
              <span className={styles.accordionIcon}>↓</span>
            </button>
            {openSections['specs'] && (
              <div className={styles.accordionContent}>
                <ul className={styles.specList}>
                  {product.specifications.map((spec, i) => (
                    <li key={i} className={styles.specItem}>
                      <span className={styles.specKey}>
                        {isAr && spec.keyAr ? spec.keyAr : spec.key}
                      </span>
                      <span className={styles.specValue}>
                        {isAr && spec.valueAr ? spec.valueAr : spec.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Delivery Info */}
        {deliveryInfo && (
          <div className={styles.accordionItem}>
            <button
              className={styles.accordionHeader}
              onClick={() => toggleSection('delivery')}
              aria-expanded={openSections['delivery']}
            >
              {isAr ? 'التوصيل والشحن' : 'Delivery & Shipping'}
              <span className={styles.accordionIcon}>↓</span>
            </button>
            {openSections['delivery'] && (
              <div className={styles.accordionContent}>
                <p style={{ margin: 0 }}>{deliveryInfo}</p>
              </div>
            )}
          </div>
        )}

        {/* Return Policy */}
        {returnPolicy && (
          <div className={styles.accordionItem}>
            <button
              className={styles.accordionHeader}
              onClick={() => toggleSection('returns')}
              aria-expanded={openSections['returns']}
            >
              {isAr ? 'سياسة الإرجاع' : 'Return Policy'}
              <span className={styles.accordionIcon}>↓</span>
            </button>
            {openSections['returns'] && (
              <div className={styles.accordionContent}>
                <p style={{ margin: 0 }}>{returnPolicy}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
