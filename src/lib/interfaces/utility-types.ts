/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A debugging type to help understand complex types.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type _Resolve<T> = {} & { [P in keyof T]: T[P] }

/**
 * A recursive version of {Identify}.
 *
 * CAUTION: This type is recursive and vulnerable to infinite loops.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type _ResolveDeep<T> = T extends object
  ? {} & { [P in keyof T]: _ResolveDeep<T[P]> }
  : T

/**
 * Any primitive type.
 */
export type Primitive = string | number | boolean | bigint | symbol

/**
 * Anything undefined or null.
 */
export type Nil = undefined | null

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
