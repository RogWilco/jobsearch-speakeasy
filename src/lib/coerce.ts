import {
  NameForPrimitive,
  Primitive,
  PrimitiveForName,
  PrimitiveName,
} from './utility-types'

type CoerceFunction<F extends Primitive, T extends Primitive> = (v: F) => T

type CoerceMap<F extends Primitive, T extends F> = {
  [K in keyof PrimitiveForName as PrimitiveForName[K] extends F ? K : never]:
    | T
    | CoerceFunction<F, T>
}

type CoerceDefaults = {
  [F in keyof PrimitiveForName]: {
    [T in keyof PrimitiveForName]: CoerceFunction<
      PrimitiveForName[F],
      PrimitiveForName[T]
    >
  }
}

class Coercion<
  F extends Primitive,
  From extends NameForPrimitive<F> = NameForPrimitive<F>,
> {
  private readonly _defaults: CoerceDefaults = {
    string: {
      string: v => v,
      number: v => Number(v),
      boolean: v => !!v,
      bigint: v => BigInt(v),
      symbol: v => Symbol(v),
    },
    number: {
      string: v => String(v),
      number: v => v,
      boolean: v => !!v,
      bigint: v => BigInt(v),
      symbol: v => Symbol(v),
    },
    boolean: {
      string: v => String(v),
      number: v => Number(v),
      boolean: v => v,
      bigint: v => BigInt(v),
      symbol: v => Symbol(`${v.toString()}`),
    },
    bigint: {
      string: v => String(v),
      number: v => Number(v),
      boolean: v => !!v,
      bigint: v => v,
      symbol: v => Symbol(`${v.toString()}`),
    },
    symbol: {
      string: v => String(v),
      number: v => Number(v),
      boolean: v => !!v,
      bigint: v => BigInt(v.description ?? ''),
      symbol: v => v,
    },
  }

  constructor(private readonly _value: F) {}

  /**
   * Coerces the value to the specified target type by applying the specified
   * transformation function.
   *
   * @param targetType the target type name to which the value will be coerced
   * @param transform the transformation function that will produce the coerced value
   *
   * @returns the coerced value
   */
  public to<To extends keyof PrimitiveForName, T extends PrimitiveForName[To]>(
    targetType: To,
    transform: CoerceFunction<F, T>,
  ): T

  /**
   * Coerces the value to the specified target type by using the specified map
   * of types to values. A value can also be a transformation function which
   * will be applied to the original value.
   *
   * @param targetType the target type name to which the value will be coerced
   * @param map the map of types to values or transformation functions
   *
   * @returns the coerced value
   */
  public to<To extends keyof PrimitiveForName, T extends PrimitiveForName[To]>(
    targetType: To,
    map: CoerceMap<F, T & F>,
  ): T

  /**
   * Coerces the value to the specified target type using the default coercion
   * rules.
   *
   * @param targetType the target type name to which the value will be coerced
   *
   * @returns the coerced value
   */
  public to<To extends keyof PrimitiveForName, T extends PrimitiveForName[To]>(
    targetType: To,
  ): T

  public to<
    To extends PrimitiveName,
    T extends PrimitiveForName[To] = PrimitiveForName[To],
  >(
    targetType: To,
    transformOrMap?: CoerceFunction<F, T> | CoerceMap<F, T & F>,
  ): PrimitiveForName[To] {
    // Handle transfomation functions
    if (typeof transformOrMap === 'function') {
      return transformOrMap(this._value)
      // Handle coerce maps
    } else if (typeof transformOrMap === 'object') {
      const transform =
        transformOrMap[typeof this._value as keyof CoerceMap<F, T & F>]

      return typeof transform === 'function'
        ? (transform(this._value) as T)
        : (transform as T)
    } else {
      return this._defaults[typeof this._value as From][targetType](
        this._value as unknown as PrimitiveForName[From],
      ) as T
    }
  }
}

/**
 * Creates a new coercion instance starting with the specified value. Chaining
 * the `to` method will coerce the value to the specified target type. The
 * coercion can be customized by providing a transformation function or a map
 * of types to values.
 *
 * @example
 * ```
 * const coercedValue: string = coerce(true).to('string')
 * ```
 *
 * @param value the value to be coerced
 *
 * @returns a new coercion instance
 */
export function coerce<
  F extends Primitive,
  From extends NameForPrimitive<F> = NameForPrimitive<F>,
>(value: F): Coercion<F, From> {
  return new Coercion(value)
}
