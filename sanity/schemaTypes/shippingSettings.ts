import { defineField, defineType } from 'sanity'

export const shippingSettingsType = defineType({
  name: 'shippingSettings',
  title: 'Shipping Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'freeShippingThreshold',
      title: 'Free Shipping Threshold (SYP)',
      type: 'number',
      description: 'Orders above this amount qualify for free shipping. Set to 0 to always charge.',
      initialValue: () => 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'standardShippingFee',
      title: 'Standard Shipping Fee (SYP)',
      type: 'number',
      initialValue: () => 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'expressShippingFee',
      title: 'Express Shipping Fee (SYP)',
      type: 'number',
      description: 'Optional express shipping option. Set to 0 to disable.',
      initialValue: () => 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'estimatedDeliveryDays',
      title: 'Estimated Delivery (days)',
      type: 'string',
      description: 'Display string shown to customers (e.g. "3-5 business days")',
      initialValue: () => '3-5 business days',
    }),
    defineField({
      name: 'estimatedDeliveryDaysAr',
      title: 'Estimated Delivery (Arabic)',
      type: 'string',
      initialValue: () => '٣-٥ أيام عمل',
    }),
    defineField({
      name: 'deliveryNotes',
      title: 'Delivery Notes (English)',
      type: 'text',
      rows: 3,
      description: 'Additional delivery information shown on product and checkout pages',
    }),
    defineField({
      name: 'deliveryNotesAr',
      title: 'Delivery Notes (Arabic)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'supportedCities',
      title: 'Supported Cities',
      type: 'array',
      description: 'List of cities where delivery is available',
      of: [
        {
          type: 'object',
          name: 'city',
          fields: [
            defineField({ name: 'name', title: 'City (English)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'nameAr', title: 'City (Arabic)', type: 'string' }),
            defineField({ name: 'shippingFee', title: 'Custom Shipping Fee (SYP)', type: 'number', description: 'Override for this city. Leave empty to use standard fee.' }),
          ],
          preview: { select: { title: 'name', subtitle: 'nameAr' } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'estimatedDeliveryDays' },
    prepare({ title }) {
      return { title: `🚚 Shipping Settings — ${title}` }
    },
  },
})
