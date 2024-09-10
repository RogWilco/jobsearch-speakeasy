# Pokédex Client

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
import { PokedexClient } from '@rogwilco/pokedex-client';

// Create a new client instance
const client = new PokedexClient();
```

### Fetching Resources

All supported root-level resources can be fetched by accessing their
corresponding root-level property on the Pokédex client instance:
`client.<resource>.<method>()`.

**Examples:**

```typescript
// Fetch the first 10 Pokémon
const firstPageOfPokemon = await client.pokemon.getMany(10);

// Fetch the first 3 generations
const generations = await client.generations.getMany(3);
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
const firstPageOfPokemon = await client.pokemon.getMany();

// Fetch the first 10 Pokémon, starting with the 6th (zero-based index)
const firstPageOfPokemon = await client.pokemon.getMany(10, 5);
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
const pikachu = await client.pokemon.getOne(25);

// Fetch a single Pokémon by name
const bulbasaur = await client.pokemon.getOne('bulbasaur');
```

#### `<resource>.getAll()`

Fetches all resources of a given type.

**<span style="color: red">WARNING</span>**: This method will invoke as
many paginated requests as required to fetch everything and may be rate-limited.

**Returns:** **`Promise<Resource[]>`**

**Example:**
```typescript
// Fetch all generations
const allGenerations = await client.generations.getAll();
```

#### `<resource>.count()`

Fetches the total count of all resources of a given type.

**Returns:** **`Promise<number>`**

**Example:**

```typescript
// Fetch the total count of all Pokémon
const totalPokemonCount = await client.pokemon.count();
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

  @Resource('/ability')    // <-- Use this decorator to define the resource's relative endpoint URL
  export class Ability extends NamedResource {
    @GetMany()    // <-- Use this decorator to indicate this field is populated when calling `getMany()`
    @GetOne()     // <-- Use this decorator to indicate this field is populated when calling `getOne()`
    id?: number;

    @GetOne(r => r.name.toLowerCase()) // <-- A custom transformation function can be provided when
    name?: string;                     //     the API response doesn't match the desired format or type.

    @GetOne<AbilityGetOne>(r => r.names.map(n => n.name)) // <-- If desired, use the decorator's generic
    names?: string[];                                     //     parameters to specify the incoming API schema



    ...
  }

  export interface AbilityGetOne {    // <-- Define the API schema for the `getOne()` method
    ...
  }

  export interface AbilityGetMany {   // <-- Define the API schema for the `getMany()` method
    ...
  }
  ```

4. Update the root `index.ts` file, adding the new resource class to the Pokédex Client:
  ```typescript
  import { Ability } from './resources/Ability';

  // ...

  // Create a new client using the ResourceClient mixin, explicitly naming the class for debugging purposes.
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

5. At this point the new resource should be fully integrated into the SDK and ready for use.

```typescript
import { PokedexClient } from '@rogwilco/pokedex-client';

const client = new PokedexClient();

// Fetch some abilities
const abilities = await client.ability.getMany();
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
