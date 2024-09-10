# Pokédex Client

[![github-verify-image]][github-verify-url]
[![Code Coverage][coverage-image]][coverage-url]

- [Installation](#installation)
- [Usage](#usage)
  - [Initializing the Client](#initializing-the-client)
  - [Fetching Resources](#fetching-resources)
  - [Supported Operations](#supported-operations)
    - [`<resource>.getMany(:limit, :offset)`](#resourcegetmanylimit-offset)
    - [`<resource>.getOne(:id | :name)`](#resourcegetoneid--name)
    - [`<resource>.getAll()`](#resourcegetall)
    - [`<resource>.count()`](#resourcecount)
- [Contributing](#contributing)
  - [Adding a New Resource](#adding-a-new-resource)
  - [Testing](#testing)
  - [Linting and Formatting](#linting-and-formatting)
  - [Generating Documentation](#generating-documentation)
- [Design Notes](#design-notes)
  - [Considerations](#considerations)
    - [Structure](#structure)
    - [Performance \& Efficiency](#performance--efficiency)
      - [API Limitations](#api-limitations)
    - [Extensibility](#extensibility)
  - [Future Improvements](#future-improvements)

## Installation

To get started, simply install the SDK using your package manager of choice:

- **[NPM](https://www.npmjs.com)**\
  `npm install --save @rogwilco/pokedex-client`
- **[Yarn](https://yarnpkg.com)**\
  `yarn add @rogwilco/pokedex-client`
- **[PNPM](https://pnpm.io)**\
  `pnpm add @rogwilco/pokedex-client`

## Usage

### Initializing the Client

```typescript
import { PokedexClient } from '@rogwilco/pokedex-client'

// Create a new client instance
const client = new PokedexClient()
```

### Fetching Resources

All supported root-level resources can be fetched by accessing their
corresponding root-level property on the Pokédex client instance:
`client.<resource>.<method>()`.

**Examples:**

```typescript
// Fetch the first 10 Pokémon
const firstPageOfPokemon = await client.pokemon.getMany(10)

// Fetch the first 3 generations
const generations = await client.generations.getMany(3)
```

### Supported Operations

#### `<resource>.getMany(:limit, :offset)`

Fetches a list of resources, with optional pagination parameters.

**Parameters:**

- `limit` (number, optional): The maximum number of resources to fetch. Defaults to `20`.
- `offset` (number, optional): The zero-based starting index of the resources to fetch. Defaults to `0`.

**Returns:** **`Promise<Resource[]>`**

**Example:**

```typescript
// Fetch the first 20 Pokémon
const firstPageOfPokemon = await client.pokemon.getMany()

// Fetch the first 10 Pokémon, starting with the 6th (zero-based index)
const firstPageOfPokemon = await client.pokemon.getMany(10, 5)
```

#### `<resource>.getOne(:id | :name)`

Fetches a single resource by ID or name.

**Parameters:**

- `id` (number, required): The ID of the resource to fetch.
- `name` (string, required): The name of the resource to fetch.

**Returns:** **`Promise<Resource>`**

**Example:**

```typescript
// Fetch a single Pokémon by ID
const pikachu = await client.pokemon.getOne(25)

// Fetch a single Pokémon by name
const bulbasaur = await client.pokemon.getOne('bulbasaur')
```

#### `<resource>.getAll()`

Fetches all resources of a given type.

**<span style="color: red">WARNING</span>**: This method will invoke as
many paginated requests as required to fetch everything and may be rate-limited.

**Returns:** **`Promise<Resource[]>`**

**Example:**

```typescript
// Fetch all generations
const allGenerations = await client.generations.getAll()
```

#### `<resource>.count()`

Fetches the total count of all resources of a given type.

**Returns:** **`Promise<number>`**

**Example:**

```typescript
// Fetch the total count of all Pokémon
const totalPokemonCount = await client.pokemon.count()
```

## Contributing

### Adding a New Resource

New resources can be added using a relatively simple process. Consider the following example for adding a new resource named `Ability`:

1. Identify the `getMany()` endpoint URL for the desired resource:\
   `https://pokeapi.co/api/v2/ability`
   - The SDK framework will automatically prepend the base URL (`https://pokeapi.co/api/v2`) to the endpoint URL.
   - The `getOne()` endpoint URL is derived from the `getMany()` URL by appending `/:id` to the end.
2. Create a new file under `./src/resources` named after the desired resource:\
   `./src/resources/Ability.ts`
3. Use the following template as a guide for defining the new resource class and its associated API schemas:

<!-- prettier-ignore-start -->
```typescript
import {
  GetMany,
  GetOne,
  NamedResource,
  Nested,
  Resource,
  ResourceClient,
  Transformable,
  Transformed,
} from '../lib'

@Resource('/ability')    // <-- Use this decorator to define the resource's endpoint relative URL
export class Ability extends NamedResource {
  @GetMany()    // <-- Use this decorator to indicate this field is populated when calling `getMany()`
  @GetOne()     // <-- Use this decorator to indicate this field is populated when calling `getOne()`
  id?: number;

  @GetOne(r => r.name.toLowerCase()) // <-- A custom transformation function can be provided when
  name?: string;                     //     the API response doesn't match the desired format or type.

  @GetOne<AbilityGetOne>(r => r.names.map(n => n.name)) // <-- If desired, use the decorator's generic
  names?: string[];                                     //     parameters to specify the incoming API schema

  // ...
}

export interface AbilityGetOne {    // <-- Define the API schema for the `getOne()` method
  // ...
}

export interface AbilityGetMany {   // <-- Define the API schema for the `getMany()` method
  // ...
}
```
<!-- prettier-ignore-end -->

1. Update the root `index.ts` file, adding the new resource class to the Pokédex Client:

<!-- prettier-ignore-start -->
```typescript
import { Ability } from './resources/Ability';

// ...

// Create a new client using the ResourceClient mixin, explicitly naming the
// class to ensure readable stack traces and easier debugging.
export class AbilityClient extends ResourceClient(Pokemon) {}

export class PokedexClient {

  // ...

  // Add a new public property to the Pokédex Client.
  public ability: AbilityClient

    constructor(config?: CreateAxiosDefaults) {

    // ...

    // Initialize the new resource client inside the constructor.
    this.ability = new AbilityClient(resolvedConfig)
  }
}
```
<!-- prettier-ignore-end -->

1. At this point the new resource should be fully integrated into the SDK and ready for use.

```typescript
import { PokedexClient } from '@rogwilco/pokedex-client'

const client = new PokedexClient()

// Fetch some abilities
const abilities = await client.ability.getMany()
```

### Testing

Test coverage will be automatically generated when runing any of the test scripts. The coverage report will be saved to `./out/coverage`.

```bash
# Run all available tests
yarn test

# Run only unit tests
yarn test:unit

# Run only end-to-end tests
yarn test:e2e

# Run a specific test file
yarn test:unit src/resources/Pokemon.test.ts
```

### Linting and Formatting

```bash
# Run ESLint
yarn lint

# Run Prettier and ESLint in fix mode
yarn format

# Run Prettier and ESLint in fix mode for a specific file
yarn format src/resources/Pokemon.ts
```

### Generating Documentation

Source documentation is generated using [TypeDoc](https://typedoc.org/). The generated documentation will be saved to `./out/docs`.

```bash
# Generate Source Code Documentation
yarn docs
```

## Design Notes

### Considerations

In this first iteration, the SDK is primarily focused around two things; providing a clean and intuitive interface for SDK consumers, and providing ease of extensibility for SDK contributors.

This came with a few key considerations:

#### Structure

The SDK is organized according to three main areas of concern:

1. **Internal:** The internal library code used by the SDK itself to interact with the API.

   - Everything within `./src/lib`
   - No API-specific logic or references.
   - Could easily be carved out into its own package.

2. **Shared:** The shared code used by both the internal library and partly exposed through the external SDK interface.

   - Everything within `./src/resources` and partially `./src/index`
   - Contains all API-specific logic and references.

3. **External:** The public-facing SDK interface that is interacted with by the consuming application or package.
   - Everything within `./src/index`
   - Serves as the point of entry for the SDK.

#### Performance & Efficiency

Due to the experimental nature of the approach, the SDK is not optimized for performance or efficiency and should not be considered as a solution intended for production use.

While some of this is due to limitations imposed by the design of the API, there are still areas where improvements could be made.

##### API Limitations

- No support for server-side query filtering or sorting.
- No support for partial responses or field selection.
- No visibility into the rate limits or throttling imposed by the API.

#### Extensibility

The declarative approach to defining resources and API schemas drew inspiraiton from other popular libaries like [TypeORM](https://typeorm.io) and [TypeGraphQL](https://typegraphql.com). For example, in the same way that TypeORM allows developers to define entities and their relationships using decorators, the SDK allows developers to define API resources and uses decorators to define how they are created from API responses.

### Future Improvements

Shoring up the performance and efficiency of the SDK would be a top priority for future iterations, as well as expanding the SDK to support a more comprehensive set of API features:

1. **Caching:** Implementing a caching mechanism to store resources that have already been fetched. This would prevent unnecessary requests and reduce the load on the API.

2. **Redundant Requests:** Optimizing the SDK to reduce the number of request needed for any given operation could be useful.

   - This could involve the wholesale removal of the `getAll()` method, which is admittedly a fairly egregious offender. In fact this method should generally be considered an anti-pattern for a production SDK.
   - The `count()` method could be optimized to prefer the cached count obtained from a previous `getMany()` or `count()` invocation.

3. **Unit Tests**: Including traditional unit tests that isolate components and mock dependencies to ensure that each part of the SDK works as expected.

4. **Contract Testing:** Implementing contract testing to ensure that the SDK's API schemas are in sync with the actual API responses. This would help catch any breaking changes to the API early on.

5. **Endpoint Parity:** Expanding the SDK to support all available API endpoints and resources. This would involve some refactoring to support linking the various nested relationships between resources.

6. **Logging & Monitoring:** Adding logging and performance monitoring would improve visibility into API reqests and responses and help developers debug issues more effectively.

7. **Generic API Client:** Separating the library code into its own package would allow the core of the SDK to support any RESTful API, not just the PokéAPI. Once generic, the following improvements could also be made:

   1. **Authentication:** Providing support for common authentication mechanisms suce as HTTP Auth and token-based schemes such as OAuth2, JWT, etc.

   2. **Multiple Protocols:** Extending the SDK to support other protocols such as GraphQL, gRPC, etc.

[github-verify-image]: https://github.com/RogWilco/jobsearch-speakeasy/actions/workflows/verify.yaml/badge.svg?name=Build 'Build Status'
[github-verify-url]: https://github.com/RogWilco/jobsearch-speakeasy/actions/workflows/verify.yaml
[coverage-image]: https://img.shields.io/codecov/c/github/rogwilco/jobsearch-speakeasy?logo=codecov&logoColor=white
[coverage-url]: https://codecov.io/gh/rogwilco/jobsearch-speakeasy
