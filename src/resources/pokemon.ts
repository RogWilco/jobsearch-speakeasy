import { NamedResource } from '../lib/named-resource'
import { GetMany, GetOne } from '../lib/resource-transformer'

export class Pokemon extends NamedResource {
  @GetOne()
  @GetMany((r) => r.url.split('/').pop())
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

  @GetOne((r) => r.species.name)
  public species?: string
}
