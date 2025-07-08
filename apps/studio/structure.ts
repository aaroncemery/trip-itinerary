import {HomeIcon, File, type LucideIcon} from 'lucide-react'
import type {StructureBuilder, StructureResolverContext} from 'sanity/structure'

import {SchemaType, SingletonType} from './schemaTypes'

type Base<T = SchemaType> = {
  id?: string
  type: T
  preview?: boolean
  title?: string
  icon?: LucideIcon
}

type CreateSingleton = {
  S: StructureBuilder
} & Base<SingletonType>

const getTitleCase = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

const createSingleTon = ({S, type, title, icon}: CreateSingleton) => {
  const newTitle = title ?? getTitleCase(type)
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type))
}

export const structure = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([createSingleTon({S, type: 'homePage', title: 'Home Page', icon: HomeIcon})])
}
