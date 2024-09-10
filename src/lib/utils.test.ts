import { camelToSnake } from './utils'

describe('utils', () => {
  it('should convert a camelCase string to snake_case', () => {
    expect(camelToSnake('exampleStringInCamelCase')).toBe(
      'example_string_in_camel_case',
    )
  })

  it('should have no effect on a snake_case string', () => {
    expect(camelToSnake('example_string_in_snake_case')).toBe(
      'example_string_in_snake_case',
    )
  })
})
