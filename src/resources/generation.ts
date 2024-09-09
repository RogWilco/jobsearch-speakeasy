import { NamedResource } from '../lib/named-resource'
import { Resource } from '../lib/resource'
import {
  GetMany,
  GetOne,
  Transformable,
  Transformed,
} from '../lib/resource-transformer'
import { Nested } from '../lib/response'

/**
 * Represents a Generation resource.
 */
@Resource('/generation')
export class Generation extends NamedResource implements Transformed {
  @GetOne()
  @GetMany<GenerationGetMany>(r =>
    Number.parseInt(r.url.match(/\/(\d+)\//)![1]),
  )
  public id?: number

  @GetOne()
  @GetMany()
  public name?: string

  @GetOne<GenerationGetOne>(r => r.main_region.name)
  public mainRegion?: string

  @GetOne<GenerationGetOne>(r => r.pokemon_species.map(p => p.name))
  public species?: string[]

  @GetOne<GenerationGetOne>(r => r.abilities.map(a => a.name))
  public abilities?: string[]

  @GetOne<GenerationGetOne>(r => r.moves.map(m => m.name))
  public moves?: string[]
}

/**
 * API schema when fetching one Generation.
 */
export interface GenerationGetOne extends Transformable {
  id: number
  name: string
  main_region: Nested
  abilities: Nested[]
  moves: Nested[]
  pokemon_species: Nested[]
  types: Nested[]
  version_groups: Nested[]
  names: {
    name: string
    language: Nested
  }[]
}

/**
 * API schema when fetching many Generations.
 */
export interface GenerationGetMany extends Transformable, Nested {}
