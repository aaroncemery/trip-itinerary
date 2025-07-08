import {HomeIcon} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  icon: HomeIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      type: 'hero',
      title: 'Hero',
    }),
    defineField({
      name: 'itinerary',
      type: 'array',
      title: 'Itinerary',
      of: [{type: 'itineraryItem'}],
    }),
  ],
  preview: {
    select: {
      title: 'hero.title',
    },
    prepare({title}) {
      return {
        title: title,
      }
    },
  },
})
