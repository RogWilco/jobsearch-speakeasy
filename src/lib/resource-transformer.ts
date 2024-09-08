import 'reflect-metadata'
import { Resource, ResourceType } from './resource'

export type TransformCallback<T extends any> = (r: T) => T[keyof T]

/**
 * A resource transformer that transforms raw API data from a particular context
 * into a valid Resource object to be returned by the SDK.
 */
export class ResourceTransformer<From> {
  /**
   * Initializes a new resource transformer with the specified data.
   *
   * @param data the data to be transformed
   *
   * @returns a new resource transformer
   */
  public static transform<From>(data: From) {
    return new ResourceTransformer<From>(data)
  }

  /**
   * Initializes a new resource transformer with the specified data and context.
   *
   * @param _data the data to be transformed
   * @param _context the context for which the data will be transformed
   */
  constructor(
    private _data: From,
    private _context?: string,
  ) {}

  /**
   * Sets the context for the transformation.
   *
   * @param context the context for the transformation
   *
   * @returns the resource transformer
   */
  public from(context: string): this {
    this._context = context
    return this
  }

  /**
   * Transforms the data from the current context to the specified resource
   * type.
   *
   * @param context the context to which the data will be transformed
   *
   * @returns the transformed data
   */
  public to<To extends Resource>(ResourceType: ResourceType<To>): To {
    const transformations = Reflect.getMetadata(
      `transform:${this._context}`,
      ResourceType,
    )

    return new ResourceType(
      Object.keys(transformations).reduce((acc, key) => {
        const transformCb = transformations[key]
        return {
          ...acc,
          [key]: transformCb(this._data),
        }
      }, {}),
    )
  }
}

/**
 * Marks a property for inclusion when processing a getOne request. Optionally
 * accepts a transformation callback to apply to the property.
 *
 * @param transformCb an optional transformation callback
 *
 * @returns the property decorator
 */
export function GetOne<R = any>(
  transformCb?: TransformCallback<R>,
): PropertyDecorator {
  return _decorate<R>('getOne', transformCb)
}

/**
 * Marks a property for inclusion when processing a getMany request. Optionally
 * accepts a transformation callback to apply to the property.
 *
 * @param transformCb an optional transformation callback
 *
 * @returns the property decorator
 */
export function GetMany<R = any>(
  transformCb?: TransformCallback<R>,
): PropertyDecorator {
  return _decorate<R>('getMany', transformCb)
}

/**
 * Applies a property transformation decorator to an object property with an
 * optional transformation callback.
 *
 * @param context the context in which the transformation is applied
 * @param transformCb an optional transformation callback
 *
 * @returns a property decorator
 */
function _decorate<R = any>(
  context: string,
  transformCb?: TransformCallback<R>,
): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      'transform:getOne',
      {
        ...Reflect.getMetadata(`transform:${context}`, target.constructor),
        [propertyKey]: transformCb ?? ((r: R) => r[propertyKey as keyof R]),
      },
      target.constructor,
    )
  }
}
