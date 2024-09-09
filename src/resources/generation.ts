import { NamedResource } from '../lib/named-resource'
import { Resource } from '../lib/resource'
import { GetMany, GetOne } from '../lib/resource-transformer'

/**
 * Represents a Generation resource.
 */
@Resource('/generation')
export class Generation extends NamedResource {
  @GetOne()
  @GetMany(r => Number.parseInt(r.url.match(/\/(\d+)\//)[1]))
  public id?: number

  @GetOne()
  @GetMany()
  public name?: string
}
