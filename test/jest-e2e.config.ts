import type { Config } from '@jest/types'

import 'jest-extended'
import 'jest-json-schema'

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testEnvironment: 'node',
  testRegex: '.*\\.(.*-)?e2e-(test|spec)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
} as Config.InitialOptions
