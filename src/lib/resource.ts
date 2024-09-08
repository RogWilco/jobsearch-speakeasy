import { Constructor, Properties } from './interfaces/utility-types'

/**
 * Represents a resource that can be retrieved from an API.
 */
export type ResourceType<T extends Resource = Resource> = Constructor<T> &
  Properties<typeof Resource>

/**
 * Represents a resource that can be retrieved from an API.
 */
export abstract class Resource {
  /**
   * Initializes a new resource with the specified data.
   *
   * @param data the data with which to initialize the resource
   */
  constructor(data: Partial<Resource>) {
    Object.assign(this, data)
  }
}
