import { Resource } from './resource'

export abstract class NamedResource extends Resource {
  public id?: number
  public name?: string
}
