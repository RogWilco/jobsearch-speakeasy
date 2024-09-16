/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A debugging type to help understand complex types.
 */
export type _Resolve<T> = {} & { [P in keyof T]: T[P] }

/**
 * A recursive version of {Identify}.
 *
 * CAUTION: This type is recursive and vulnerable to infinite loops.
 */
export type _ResolveDeep<T> = T extends object
  ? {} & { [P in keyof T]: _ResolveDeep<T[P]> }
  : T

/**
 * Any primitive type.
 */
export type Primitive = string | number | boolean | bigint | symbol

/**
 * The name of any primitive type. Useful when using `typeof` in type guards.
 */
export type PrimitiveName =
  | 'string'
  | 'number'
  | 'boolean'
  | 'bigint'
  | 'symbol'

/**
 * A map of primitive types names to their respective types.
 */
export type PrimitiveForName = Record<PrimitiveName, Primitive> & {
  string: string
  number: number
  boolean: boolean
  bigint: bigint
  symbol: symbol
}

/**
 * A type that represents the name of a primitive type.
 */
export type NameForPrimitive<T extends Primitive> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends bigint
        ? 'bigint'
        : T extends symbol
          ? 'symbol'
          : never

/**
 * Anything undefined or null.
 */
export type Nil = undefined | null

/**
 * Any function that returns T.
 */
export type Func<T = any, U extends any[] = any[]> = (...args: U) => T

/**
 * A constructor of T.
 */
export type Constructor<T, U extends any[] = any[]> = new (...args: U) => T

/**
 * Construct a type containing all properties from T.
 */
export type Properties<T> = {
  [K in keyof T]: T[K]
}

/**
 * Allow one T or an array of many Ts.
 */
export type OneOrMany<T> = T | T[]
