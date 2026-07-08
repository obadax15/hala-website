import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Halahello',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (English)',
      type: 'string',
      description: 'Short brand tagline shown in footer and meta',
    }),
    defineField({
      name: 'taglineAr',
      title: 'Tagline (Arabic)',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Contact Number',
      type: 'string',
      description: 'E.164 format, e.g. +963912345678 — used for the WhatsApp contact button',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
    }),
    defineField({
      name: 'supportEmail',
      title: 'Support Email',
      type: 'string',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Copyright Text (English)',
      type: 'string',
      description: 'e.g. "© 2026 Halahello. All rights reserved."',
    }),
    defineField({
      name: 'footerTextAr',
      title: 'Footer Copyright Text (Arabic)',
      type: 'string',
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar Text (English)',
      type: 'string',
      description: 'Optional top-of-page banner (e.g. "Free shipping on orders over 50,000 SYP")',
    }),
    defineField({
      name: 'announcementBarAr',
      title: 'Announcement Bar Text (Arabic)',
      type: 'string',
    }),
    defineField({
      name: 'announcementBarActive',
      title: 'Show Announcement Bar',
      type: 'boolean',
      initialValue: () => false,
    }),
  ],
  preview: {
    select: { title: 'siteName', media: 'logo' },
    prepare({ title, media }) {
      return { title: `⚙️ ${title} — Site Settings`, media }
    },
  },
})
