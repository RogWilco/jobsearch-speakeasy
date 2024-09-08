import { NamedResource } from '../lib/named-resource'
import { GetMany, GetOne } from '../lib/resource-transformer'

export class Generation extends NamedResource {
  @GetOne()
  @GetMany((r) => r.url.split('/').pop())
  public id?: number

  @GetOne()
  @GetMany()
  public name?: string
}
