import { defineField, defineType } from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote (English)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quoteAr',
      title: 'Quote (Arabic)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'author',
      title: 'Customer Name (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorAr',
      title: 'Customer Name (Arabic)',
      type: 'string',
    }),
    defineField({
      name: 'avatarImage',
      title: 'Customer Avatar',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional customer photo or avatar',
    }),
    defineField({
      name: 'productReference',
      title: 'Product Reviewed',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Optional — link to the product this review is about',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: () => 5,
    }),
    defineField({
      name: 'isActive',
      title: 'Active / Show on Website',
      type: 'boolean',
      initialValue: () => true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'quote',
      rating: 'rating',
      isActive: 'isActive',
      media: 'avatarImage',
    },
    prepare({ title, subtitle, rating, isActive, media }) {
      const stars = '★'.repeat(rating ?? 5)
      return {
        title: `${isActive ? '🟢' : '🔴'} ${title} — ${stars}`,
        subtitle: subtitle?.slice(0, 80),
        media,
      }
    },
  },
})
