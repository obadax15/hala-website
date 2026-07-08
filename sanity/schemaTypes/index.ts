import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product'
import { promotionType } from './promotion'
import { homepageBannerType } from './homepageBanner'
import { testimonialType } from './testimonial'
import { siteSettingsType } from './siteSettings'
import { faqType } from './faq'
import { shippingSettingsType } from './shippingSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Content
    productType,
    promotionType,
    homepageBannerType,
    testimonialType,
    faqType,
    // Singletons
    siteSettingsType,
    shippingSettingsType,
  ],
}
