import {Star} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  icon: Star,
  type: 'object',
  fields: [
    defineField({
      name: 'badge',
      type: 'string',
      title: 'Badge',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare: ({title}) => ({
      title,
      subtitle: 'Hero Block',
      media: Star,
    }),
  },
})
