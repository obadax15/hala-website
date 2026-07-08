import { defineField, defineType } from 'sanity'

export const promotionType = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleAr',
      title: 'Title (Arabic)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'descriptionAr',
      title: 'Description (Arabic)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage Off (%)', value: 'PERCENTAGE' },
          { title: 'Fixed Amount Off', value: 'FIXED' },
          { title: 'Buy X Get Y', value: 'BUY_X_GET_Y' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value',
      type: 'number',
      description: 'Percentage (0-100) for PERCENTAGE type, or fixed amount for FIXED type',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'buyQuantity',
      title: 'Buy Quantity (Buy X Get Y)',
      type: 'number',
      description: 'Required when discountType is BUY_X_GET_Y',
      hidden: ({ document }) => document?.discountType !== 'BUY_X_GET_Y',
    }),
    defineField({
      name: 'getQuantity',
      title: 'Get Quantity (Buy X Get Y)',
      type: 'number',
      description: 'Required when discountType is BUY_X_GET_Y',
      hidden: ({ document }) => document?.discountType !== 'BUY_X_GET_Y',
    }),
    defineField({
      name: 'couponCode',
      title: 'Coupon Code',
      type: 'string',
      description: 'Optional — if set, customers must enter this code to activate the promotion',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Master switch — set to false to disable without deleting',
      initialValue: () => true,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Promotion',
      type: 'boolean',
      description: 'Show in the Featured Promotions section on the homepage hero',
      initialValue: () => false,
    }),
    defineField({
      name: 'isFlashSale',
      title: 'Flash Sale',
      type: 'boolean',
      description: 'Show a live countdown timer on this promotion',
      initialValue: () => false,
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Used as the hero banner image for this promotion',
    }),
    defineField({
      name: 'linkedProducts',
      title: 'Linked Products',
      type: 'array',
      description: 'Specific products this promotion applies to (leave empty for store-wide)',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({
      name: 'linkedCategories',
      title: 'Linked Categories',
      type: 'array',
      description: 'Categories this promotion applies to (e.g. hijab, plexi)',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Hijab', value: 'hijab' },
          { title: 'Plexi', value: 'plexi' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      discountType: 'discountType',
      discountValue: 'discountValue',
      isActive: 'isActive',
      isFeatured: 'isFeatured',
      media: 'bannerImage',
    },
    prepare({ title, discountType, discountValue, isActive, isFeatured, media }) {
      const statusIcon = isActive ? '🟢' : '🔴'
      const featuredIcon = isFeatured ? '⭐ ' : ''
      const discountLabel =
        discountType === 'PERCENTAGE' ? `${discountValue}% off`
        : discountType === 'FIXED' ? `${discountValue} SYP off`
        : 'Buy X Get Y'
      return {
        title: `${statusIcon} ${featuredIcon}${title}`,
        subtitle: discountLabel,
        media,
      }
    },
  },
})
