import { BaseResource } from './resource'

/**
 * Represents a named resource as defined by the PokeAPI.
 */
export abstract class NamedResource extends BaseResource {
  public id?: number
  public name?: string
}
