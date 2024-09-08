import { Constructor, Properties } from './interfaces/utility-types'

/**
 * Represents a resource that can be retrieved from an API.
 */
export type BaseResourceType<T extends BaseResource = BaseResource> =
  Constructor<T> & Properties<typeof BaseResource>

/**
 * Represents a resource that can be retrieved from an API.
 */
export abstract class BaseResource {
  /**
   * Initializes a new resource with the specified data.
   *
   * @param data the data with which to initialize the resource
   */
  constructor(data: Partial<BaseResource>) {
    Object.assign(this, data)
  }
}

/**
 * Marks a class as a resource accessible at the specified relative path.
 *
 * @param resourcePath the relative path to the resource endpoint
 *
 * @returns the class decorator
 */
export function Resource(resourcePath: string): ClassDecorator {
  return target => {
    Reflect.defineMetadata('resource:path', resourcePath, target)
  }
}
