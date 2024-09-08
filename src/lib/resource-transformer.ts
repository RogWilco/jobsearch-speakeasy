import 'reflect-metadata'
import { BaseResource, BaseResourceType } from './resource'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transformable = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transformed = BaseResource & Record<string, any>
export type TransformCallback<
  From extends Transformable,
  To extends Transformed,
> = (r: From) => To[keyof To]

/**
 * A resource transformer that transforms raw API data from a particular context
 * into a valid Resource object to be returned by the SDK.
 */
export class ResourceTransformer<From extends Transformable> {
  /**
   * Initializes a new resource transformer with the specified data.
   *
   * @param data the data to be transformed
   *
   * @returns a new resource transformer
   */
  public static transform<From extends Transformable>(
    data: From,
  ): ResourceTransformer<From> {
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
  public to<To extends Transformed>(ResourceType: BaseResourceType<To>): To {
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
export function GetOne<From extends Transformable, To extends Transformed>(
  transformCb?: TransformCallback<From, To>,
): PropertyDecorator {
  return _decorate('getOne', transformCb)
}

/**
 * Marks a property for inclusion when processing a getMany request. Optionally
 * accepts a transformation callback to apply to the property.
 *
 * @param transformCb an optional transformation callback
 *
 * @returns the property decorator
 */
export function GetMany<From extends Transformable, To extends Transformed>(
  transformCb?: TransformCallback<From, To>,
): PropertyDecorator {
  return _decorate('getMany', transformCb)
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
function _decorate<
  From extends Transformable = Transformable,
  To extends Transformed = Transformed,
>(
  context: string,
  transformCb?: TransformCallback<From, To>,
): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(
      `transform:${context}`,
      {
        ...Reflect.getMetadata(`transform:${context}`, target.constructor),
        [propertyKey]: transformCb ?? (r => r[propertyKey as keyof typeof r]),
      },
      target.constructor,
    )
  }
}
