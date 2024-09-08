import { NamedResource } from '../lib/named-resource'
import { GetMany, GetOne } from '../lib/resource-transformer'

export class Pokemon extends NamedResource {
  @GetOne()
  @GetMany(r => Number.parseInt(r.url.match(/\/(\d+)\//)[1]))
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

  @GetOne(r => r.species.name)
  public species?: string

  @GetOne(r => r.moves.map(m => m.move.name))
  public moves?: string[]
}
