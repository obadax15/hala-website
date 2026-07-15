import { defineField, defineType } from 'sanity'

export const userType = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  readOnly: true, // Synced from PostgreSQL, admins should not edit here
  fields: [
    defineField({
      name: 'pgId',
      title: 'PostgreSQL ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'whatsappPhone',
      title: 'WhatsApp Phone',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Customer', value: 'CUSTOMER' },
          { title: 'Admin', value: 'ADMIN' },
        ],
      },
    }),
    defineField({
      name: 'whatsappVerified',
      title: 'WhatsApp Verified',
      type: 'boolean',
    }),
    defineField({
      name: 'pgCreatedAt',
      title: 'Joined Date',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      phone: 'whatsappPhone',
    },
    prepare(selection) {
      const { title, subtitle, phone } = selection
      return {
        title: title || phone || 'Unnamed User',
        subtitle: subtitle || phone || 'No contact info',
      }
    },
  },
})
