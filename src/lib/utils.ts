/**
 * Converts a snake_case string to camelCase.
 *
 * @param camelCase the string to be converted to snake case
 *
 * @returns the snake case string
 */
export function camelToSnake(camelCase: string): string {
  return camelCase.replace(/([A-Z])/g, '_$1').toLowerCase()
}
