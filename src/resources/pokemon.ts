import { NamedResource } from '../lib/named-resource'
import { Resource } from '../lib/resource'
import { GetMany, GetOne } from '../lib/resource-transformer'

/**
 * Represents a Pokemon resource.
 */
@Resource('/pokemon')
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @GetOne(r => r.moves.map((m: any) => m.move.name))
  public moves?: string[]
}
