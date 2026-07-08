import type { StructureResolver } from 'sanity/structure'

/**
 * Custom Sanity Studio structure.
 * Singletons (siteSettings, shippingSettings) appear as single documents
 * rather than list views. All other types are standard document lists.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Halahello Studio')
    .items([
      // ── Catalogue ────────────────────────────────────────────
      S.listItem()
        .title('Products')
        .icon(() => '▦')
        .child(S.documentTypeList('product').title('Products')),

      S.listItem()
        .title('Promotions & Offers')
        .icon(() => '🏷️')
        .child(S.documentTypeList('promotion').title('Promotions')),

      S.divider(),

      // ── Homepage ─────────────────────────────────────────────
      S.listItem()
        .title('Homepage Banners')
        .icon(() => '🖼️')
        .child(S.documentTypeList('homepageBanner').title('Homepage Banners')),

      S.listItem()
        .title('Testimonials')
        .icon(() => '⭐')
        .child(S.documentTypeList('testimonial').title('Testimonials')),

      S.divider(),

      // ── Support Content ───────────────────────────────────────
      S.listItem()
        .title('FAQ')
        .icon(() => '❓')
        .child(S.documentTypeList('faq').title('FAQ')),

      S.divider(),

      // ── Singletons ────────────────────────────────────────────
      S.listItem()
        .title('Site Settings')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),

      S.listItem()
        .title('Shipping Settings')
        .icon(() => '🚚')
        .child(
          S.document()
            .schemaType('shippingSettings')
            .documentId('shippingSettings')
            .title('Shipping Settings')
        ),
    ])
