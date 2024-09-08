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
   * Creates a new instance using the provided data.
   *
   * @param this the current subclass definition
   * @param data the data with which to initialize the resource
   *
   * @returns the created resource
   */
  static create<T extends Resource>(this: new () => T, data: Partial<T>): T {
    return Object.assign(new this(), data)
  }

  constructor(data: Partial<Resource>) {
    Object.assign(this, data)
  }
}
