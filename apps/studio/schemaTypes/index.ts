import {blocks} from './blocks'
import {singletonDocuments} from './documents'

export const schemaTypes = [...blocks, ...singletonDocuments]

export const schemaNames = [...blocks, ...singletonDocuments].map((doc) => doc.name)

export type SchemaType = (typeof schemaNames)[number]

export const singletonTypes = singletonDocuments.map((doc) => doc.name)

export type SingletonType = (typeof singletonTypes)[number]

export default schemaTypes
