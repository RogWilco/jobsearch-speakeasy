import * as extendedMatchers from 'jest-extended'
import { matchers as jsonSchemaMatchers } from 'jest-json-schema'

expect.extend(jsonSchemaMatchers)
expect.extend(extendedMatchers)
