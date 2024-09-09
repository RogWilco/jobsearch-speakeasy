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
 * Represents a Pokemon resource.
 */
@Resource('/pokemon')
export class Pokemon extends NamedResource implements Transformed {
  @GetOne()
  @GetMany<PokemonGetMany>(r => Number.parseInt(r.url.match(/\/(\d+)\//)![1]))
  public id?: number

  @GetOne()
  @GetMany()
  public name?: string

  @GetOne()
  public height?: number

  @GetOne()
  public weight?: number

  @GetOne()
  public baseExperience?: number

  @GetOne()
  public order?: number

  @GetOne<PokemonGetOne>(r => r.species.name)
  public species?: string

  @GetOne<PokemonGetOne>(r => r.moves.map(m => m.name))
  public moves?: string[]
}

/**
 * API schema when fetching one Pokemon.
 */
export interface PokemonGetOne extends Transformable {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  order: number
  species: Nested
  abilities: Nested[]
  moves: Nested[]
  types: Nested[]
  stats: {
    base_stat: number
    effort: number
    stat: string
  }[]
}

/**
 * API schema when fetching many Pokemon.
 */
export interface PokemonGetMany extends Transformable, Nested {}
