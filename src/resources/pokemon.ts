import { NamedResource } from '../lib/named-resource'

export class Pokemon extends NamedResource {
  public height?: number
  public weight?: number
  public baseExperience?: number
  public order?: number
  public species?: string

  constructor(data: Partial<Pokemon>) {
    super(data)
  }
}
