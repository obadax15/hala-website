import { defineField, defineType } from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'questionAr',
      title: 'Question (Arabic)',
      type: 'string',
    }),
    defineField({
      name: 'answer',
      title: 'Answer (English)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answerAr',
      title: 'Answer (Arabic)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Orders', value: 'orders' },
          { title: 'Shipping', value: 'shipping' },
          { title: 'Returns', value: 'returns' },
          { title: 'Products', value: 'products' },
          { title: 'Payment', value: 'payment' },
          { title: 'General', value: 'general' },
        ],
      },
      initialValue: () => 'general',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first within the same category',
      initialValue: () => 10,
    }),
    defineField({
      name: 'isActive',
      title: 'Active / Show on Website',
      type: 'boolean',
      initialValue: () => true,
    }),
  ],
  orderings: [
    {
      title: 'Category then Order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      isActive: 'isActive',
    },
    prepare({ title, category, isActive }) {
      return {
        title: `${isActive ? '🟢' : '🔴'} ${title}`,
        subtitle: category?.toUpperCase() ?? 'GENERAL',
      }
    },
  },
})
