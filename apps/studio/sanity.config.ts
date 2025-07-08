import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {googleMapsInput} from '@sanity/google-maps-input'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Trip Itinerary',

  projectId: 'dj0h2mox',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    unsplashImageAsset(),
    googleMapsInput({apiKey: process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY ?? ''}),
  ],

  schema: {
    types: schemaTypes,
  },
})
