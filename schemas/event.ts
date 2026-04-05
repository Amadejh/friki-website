import { defineField, defineType } from 'sanity'

export const eventSchema = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Event Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'Display string e.g. "April 18, 2025" or "May 3–4, 2025"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g. "20:00"',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Social', value: 'Social' },
          { title: 'Tech', value: 'Tech' },
          { title: 'Community', value: 'Community' },
          { title: 'Career', value: 'Career' },
          { title: 'Sport', value: 'Sport' },
          { title: 'Gaming', value: 'Gaming' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(2020).max(2100),
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'text',
      rows: 2,
      description: 'Short summary shown on cards',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      description: 'Full event description shown on detail page',
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isArchived',
      title: 'Is Archived',
      type: 'boolean',
      description: 'Archived events appear in the past events grid. Upcoming events appear in the carousel.',
      initialValue: false,
    }),
    defineField({
      name: 'ticketsAvailable',
      title: 'Tickets Available',
      type: 'boolean',
      description: 'Enable Stripe ticket purchase flow for this event.',
      initialValue: false,
    }),
    defineField({
      name: 'ticketPrice',
      title: 'Ticket Price (€)',
      type: 'number',
      hidden: ({ document }) => !document?.ticketsAvailable,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'date',
      media: 'poster',
    },
  },
})
