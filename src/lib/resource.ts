import { Transformed } from './resource-transformer'
import { Constructor, Properties } from './utility-types'

/**
 * Represents a resource that can be retrieved from an API.
 */
export type BaseResourceType<T extends BaseResource = BaseResource> =
  Constructor<T> & Properties<typeof BaseResource>

/**
 * Represents a resource that can be retrieved from an API.
 */
export abstract class BaseResource implements Transformed {
  /**
   * Creates a new instance using the specified data.
   *
   * @param this the current subclass definition
   * @param data the data with which to initialize the entity
   *
   * @returns the created entity
   */
  static create<T extends BaseResource>(
    this: Constructor<T>,
    data: Partial<T>,
  ): T {
    return Object.assign(new this(), data)
  }

  /**
   * Returns a JSON string representation of the resource.
   *
   * @returns the resource as a JSON string
   */
  toString(): string {
    return JSON.stringify(this)
  }
}

/**
 * Represents a named resource as defined by the PokeAPI.
 */
export abstract class NamedResource extends BaseResource {
  public id?: number
  public name?: string
}

/**
 * Marks a class as a resource accessible at the specified relative path.
 *
 * @param resourcePath the relative path to the resource endpoint
 *
 * @returns the class decorator
 */
export function Resource(resourcePath: string): ClassDecorator {
  if (!resourcePath) {
    throw new Error('Resource path must be provided')
  }

  return target => {
    Reflect.defineMetadata('resource:path', resourcePath, target)
  }
}
