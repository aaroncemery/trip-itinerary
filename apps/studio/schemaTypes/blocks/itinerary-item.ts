import {defineField, defineType} from 'sanity'
import {formatDate} from '../../utils/helpers'

export const itineraryItem = defineType({
  name: 'itineraryItem',
  title: 'Itinerary Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      title: 'Date',
    }),
    defineField({
      name: 'map',
      type: 'geopoint',
      title: 'Map',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      const date = subtitle ? formatDate(subtitle) : 'No date'
      return {
        title: title,
        subtitle: date,
        media: media,
      }
    },
  },
})
