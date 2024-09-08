import { BaseResource } from './resource'

export abstract class NamedResource extends BaseResource {
  public id?: number
  public name?: string
}
