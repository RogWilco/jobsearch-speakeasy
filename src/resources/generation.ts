import { NamedResource } from '../lib/named-resource'
import { GetMany, GetOne } from '../lib/resource-transformer'

export class Generation extends NamedResource {
  @GetOne()
  @GetMany((r) => Number.parseInt(r.url.match(/\/(\d+)\//)[1]))
  public id?: number

  @GetOne()
  @GetMany()
  public name?: string
}
