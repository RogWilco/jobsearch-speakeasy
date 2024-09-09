import { Transformable } from './resource-transformer'

export interface Paginated<T extends Transformable> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Nested {
  name: string
  url: string
}
